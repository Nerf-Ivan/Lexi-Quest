const mongoose = require('mongoose');
const validator = require('validator');

//A Schema for the User model
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    // Field for liked words with enhanced structure
    likedWords: [{
        word: {
            type: String,
            required: true
        },
        dateAdded: {
            type: Date,
            default: Date.now
        }
    }],
    // Search history
    searchHistory: [{
        word: String,
        searchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // User preferences
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        dailyWordNotifications: {
            type: Boolean,
            default: true
        }
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
UserSchema.index({ 'likedWords.word': 1 });
UserSchema.index({ 'searchHistory.word': 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Method to add word to liked words (avoiding duplicates)
UserSchema.methods.addLikedWord = function(word) {
    const existingWord = this.likedWords.find(item => item.word === word);
    if (!existingWord) {
        this.likedWords.push({ word });
    }
    return this.save();
};

// Method to remove word from liked words
UserSchema.methods.removeLikedWord = function(word) {
    this.likedWords = this.likedWords.filter(item => item.word !== word);
    return this.save();
};

// Method to add to search history (limit to last 50 searches)
UserSchema.methods.addToSearchHistory = function(word) {
    // Remove existing entry if it exists
    this.searchHistory = this.searchHistory.filter(item => item.word !== word);
    // Add to beginning
    this.searchHistory.unshift({ word });
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
        this.searchHistory = this.searchHistory.slice(0, 50);
    }
    return this.save();
};

//Create and export the model
module.exports = mongoose.model('User', UserSchema);
