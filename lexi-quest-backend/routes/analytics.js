const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const User = require('../models/User');

// --- GET POPULAR WORDS ---
//@route GET /api/analytics/popular
//@desc Get most popular words
//@access Public
router.get('/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const popularWords = await Word.getPopularWords(limit);
        
        res.json(popularWords);
    } catch (error) {
        console.error('Get popular words error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET TRENDING WORDS ---
//@route GET /api/analytics/trending
//@desc Get trending words (popular in last 7 days)
//@access Public
router.get('/trending', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const trendingWords = await Word.getTrendingWords(limit);
        
        res.json(trendingWords);
    } catch (error) {
        console.error('Get trending words error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET WORD OF THE DAY ---
//@route GET /api/analytics/word-of-the-day
//@desc Get word of the day (most searched word yesterday)
//@access Public
router.get('/word-of-the-day', async (req, res) => {
    try {
        // Get yesterday's date range
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        
        // Find the most searched word from yesterday
        const wordOfTheDay = await Word.findOne({
            lastSearched: {
                $gte: yesterday,
                $lte: endOfYesterday
            }
        })
        .sort({ searchCount: -1 })
        .select('word phonetic meanings searchCount');
        
        if (!wordOfTheDay) {
            // Fallback to a default word if no searches yesterday
            return res.json({
                word: 'serendipity',
                phonetic: '/ˌser.ənˈdɪp.ɪ.ti/',
                definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
                isDefault: true
            });
        }
        
        // Format the response
        const firstMeaning = wordOfTheDay.meanings[0];
        const firstDefinition = firstMeaning?.definitions[0];
        
        res.json({
            word: wordOfTheDay.word,
            phonetic: wordOfTheDay.phonetic,
            definition: firstDefinition?.definition || 'No definition available',
            example: firstDefinition?.example || '',
            partOfSpeech: firstMeaning?.partOfSpeech || '',
            searchCount: wordOfTheDay.searchCount,
            isDefault: false
        });
    } catch (error) {
        console.error('Get word of the day error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET PLATFORM STATISTICS ---
//@route GET /api/analytics/stats
//@desc Get overall platform statistics
//@access Public
router.get('/stats', async (req, res) => {
    try {
        const [
            totalWords,
            totalUsers,
            totalSearches,
            totalLikes
        ] = await Promise.all([
            Word.countDocuments(),
            User.countDocuments(),
            Word.aggregate([{ $group: { _id: null, total: { $sum: '$searchCount' } } }]),
            Word.aggregate([{ $group: { _id: null, total: { $sum: '$likeCount' } } }])
        ]);
        
        res.json({
            totalWords,
            totalUsers,
            totalSearches: totalSearches[0]?.total || 0,
            totalLikes: totalLikes[0]?.total || 0
        });
    } catch (error) {
        console.error('Get platform stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;