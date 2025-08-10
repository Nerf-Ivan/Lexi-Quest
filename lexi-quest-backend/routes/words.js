const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// LIKE A WORD
//@route POST /api/words/like
//@desc Like a word 
//@access Private
router.post('/like', auth, async (req, res) => {
    const { word } = req.body;

    try {
        // Input validation
        if (!word || typeof word !== 'string' || word.trim().length === 0) {
            return res.status(400).json({ error: 'Word is required' });
        }

        const sanitizedWord = word.trim().toLowerCase();
        
        // Find the user and update their liked words
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use the model method to add liked word
        await user.addLikedWord(sanitizedWord);

        // Return the updated liked words with full details
        const likedWordsWithDetails = user.likedWords.map(item => ({
            word: item.word,
            dateAdded: item.dateAdded
        }));

        res.json({
            message: 'Word added to favorites',
            likedWords: likedWordsWithDetails
        });
    } catch (error) {
        console.error('Like word error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// --- UNLIKE A WORD
//@route DELETE /api/words/unlike/:word
//@desc Remove a word from the user's liked word list
//@access Private
router.delete('/unlike/:word', auth, async (req, res) => {
    const { word } = req.params;

    try {
        if (!word || word.trim().length === 0) {
            return res.status(400).json({ error: 'Word parameter is required' });
        }

        const sanitizedWord = word.trim().toLowerCase();
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Use the model method to remove liked word
        await user.removeLikedWord(sanitizedWord);
        
        // Return the updated liked words with full details
        const likedWordsWithDetails = user.likedWords.map(item => ({
            word: item.word,
            dateAdded: item.dateAdded
        }));

        res.json({
            message: 'Word removed from favorites',
            likedWords: likedWordsWithDetails
        });
    } catch (error) {
        console.error('Unlike word error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET LIKED WORDS ---
//@route GET /api/words/liked
//@desc Get the list of liked words for the authenticated user
//@access Private
router.get('/liked', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return liked words with full details, sorted by date added (newest first)
        const likedWordsWithDetails = user.likedWords
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .map(item => ({
                word: item.word,
                dateAdded: item.dateAdded
            }));
        
        res.json(likedWordsWithDetails);
    } catch (error) {
        console.error('Get liked words error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- ADD TO SEARCH HISTORY ---
//@route POST /api/words/search-history
//@desc Add a word to search history
//@access Private
router.post('/search-history', auth, async (req, res) => {
    const { word } = req.body;

    try {
        if (!word || typeof word !== 'string' || word.trim().length === 0) {
            return res.status(400).json({ error: 'Word is required' });
        }

        const sanitizedWord = word.trim().toLowerCase();
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use the model method to add to search history
        await user.addToSearchHistory(sanitizedWord);

        res.json({ message: 'Added to search history' });
    } catch (error) {
        console.error('Add to search history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET SEARCH HISTORY ---
//@route GET /api/words/search-history
//@desc Get the search history for the authenticated user
//@access Private
router.get('/search-history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return search history (already sorted by most recent first)
        const searchHistory = user.searchHistory.map(item => ({
            word: item.word,
            searchedAt: item.searchedAt
        }));
        
        res.json(searchHistory);
    } catch (error) {
        console.error('Get search history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- GET WORD STATISTICS ---
//@route GET /api/words/stats
//@desc Get word statistics for the authenticated user
//@access Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const stats = {
            totalLikedWords: user.likedWords.length,
            totalSearches: user.searchHistory.length,
            recentSearches: user.searchHistory.slice(0, 5).map(item => item.word),
            memberSince: user.createdAt,
            lastActivity: user.lastLogin || user.updatedAt
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;