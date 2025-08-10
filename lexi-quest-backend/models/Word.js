const mongoose = require('mongoose');

// Schema for storing word definitions and analytics
const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    phonetic: {
        type: String,
        default: ''
    },
    phoneticAudio: {
        type: String,
        default: ''
    },
    origin: {
        type: String,
        default: ''
    },
    meanings: [{
        partOfSpeech: String,
        definitions: [{
            definition: String,
            example: String,
            synonyms: [String],
            antonyms: [String]
        }],
        synonyms: [String],
        antonyms: [String]
    }],
    sourceUrls: [String],
    // Analytics
    searchCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    lastSearched: {
        type: Date,
        default: Date.now
    },
    // Cache control
    cacheExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
}, {
    timestamps: true
});

// Index for analytics queries
WordSchema.index({ searchCount: -1 });
WordSchema.index({ likeCount: -1 });
WordSchema.index({ lastSearched: -1 });

// Method to increment search count
WordSchema.methods.incrementSearchCount = function() {
    this.searchCount += 1;
    this.lastSearched = new Date();
    return this.save();
};

// Method to increment like count
WordSchema.methods.incrementLikeCount = function() {
    this.likeCount += 1;
    return this.save();
};

// Method to decrement like count
WordSchema.methods.decrementLikeCount = function() {
    this.likeCount = Math.max(0, this.likeCount - 1);
    return this.save();
};

// Static method to get popular words
WordSchema.statics.getPopularWords = function(limit = 10) {
    return this.find({})
        .sort({ searchCount: -1 })
        .limit(limit)
        .select('word searchCount likeCount');
};

// Static method to get trending words (popular in last 7 days)
WordSchema.statics.getTrendingWords = function(limit = 10) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.find({ lastSearched: { $gte: weekAgo } })
        .sort({ searchCount: -1 })
        .limit(limit)
        .select('word searchCount likeCount lastSearched');
};

module.exports = mongoose.model('Word', WordSchema);