//Authentication logic
const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User'); // Import the User model
const auth = require('../middleware/auth');
const router = express.Router();


// --- Registration Route ---
// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Check password strength
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
            });
        }
        
        // Check if the user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        // Create a new user
        user = new User({ 
            email: email.toLowerCase(), 
            password,
            firstName: firstName?.trim(),
            lastName: lastName?.trim()
        });
        
        // Hash the password before saving
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Create and return a JSON Web Token (JWT)
        const payload = { 
            user: { 
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            } 
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '7d' }, // Extended token expiration time
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ error: 'Error generating token' });
                }
                res.status(201).json({ 
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        fullName: user.fullName
                    }
                });
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// --- Login Route ---
// @route POST /api/auth/login
// @desc Authenticate user and return a token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        
        // Check if the user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
        // Check if account is active
        if (!user.isActive) {
            return res.status(400).json({ error: 'Account has been deactivated' });
        }
        
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Create and return a JSON Web Token (JWT)
        const payload = { 
            user: { 
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            } 
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '7d' }, // Extended token expiration time
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ error: 'Error generating token' });
                }
                res.json({ 
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        fullName: user.fullName,
                        lastLogin: user.lastLogin
                    }
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --- Get Current User Route ---
// @route GET /api/auth/me
// @desc Get current user info
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            preferences: user.preferences,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Update User Profile Route ---
// @route PUT /api/auth/profile
// @desc Update user profile
// @access Private
router.put('/profile', auth, async (req, res) => {
    const { firstName, lastName, preferences } = req.body;
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update fields if provided
        if (firstName !== undefined) user.firstName = firstName.trim();
        if (lastName !== undefined) user.lastName = lastName.trim();
        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }
        
        await user.save();
        
        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;