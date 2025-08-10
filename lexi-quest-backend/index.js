//Import necessary packages
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

//initialize the express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware 
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;

// Global variable to track database connection status
let isDbConnected = false;

// Use mongoose to connect to the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Atlas successfully');
        isDbConnected = true;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        console.log('Running in demo mode without database. Some features may be limited.');
        isDbConnected = false;
    }
};

// Connect to database
connectDB();

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
    if (!isDbConnected && req.path.includes('/api/')) {
        // For demo purposes, we'll allow some endpoints to work without DB
        if (req.path.includes('/search/') || req.path === '/') {
            return next();
        }
        return res.status(503).json({ 
            error: 'Database not available. Please check your MongoDB connection.',
            demo: true
        });
    }
    next();
};

app.use(checkDbConnection);

//---Routes---
app.get('/', (req, res) => {
    res.json({
        message: 'LexiQuest Backend is running!',
        version: '2.0.0',
        database: isDbConnected ? 'Connected' : 'Disconnected',
        endpoints: {
            auth: '/api/auth',
            words: '/api/words',
            analytics: '/api/analytics',
            search: '/api/search/:word'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: isDbConnected ? 'connected' : 'disconnected'
    });
});

// Use routes - load them regardless of DB connection, let individual routes handle DB checks
try {
    app.use('/api/auth', require('./routes/auth')); // Import and use the auth routes
    app.use('/api/words', require('./routes/words')); // Import and use the words routes
    app.use('/api/analytics', require('./routes/analytics')); // Import and use the analytics routes
    console.log('Routes loaded successfully');
} catch (error) {
    console.log('Error loading route files:', error.message);
    console.log('Using demo endpoints only');
}

//Define the main API endpoint for searching a word
app.get('/api/search/:word', async (req, res) => {
    const { word } = req.params;
    
    // Input validation
    if (!word || word.trim().length === 0) {
        return res.status(400).json({ error: 'Word parameter is required' });
    }
    
    // Sanitize input
    const sanitizedWord = word.trim().toLowerCase().replace(/[^a-zA-Z\s-]/g, '');
    if (sanitizedWord.length === 0) {
        return res.status(400).json({ error: 'Invalid word format' });
    }
    
    console.log(`Received search request for word: ${sanitizedWord}`);

    try {
        // If database is connected, try to use Word model for caching
        if (isDbConnected) {
            try {
                const Word = require('./models/Word');
                
                // Check if word exists in cache and is not expired
                let cachedWord = await Word.findOne({ 
                    word: sanitizedWord,
                    cacheExpiry: { $gt: new Date() }
                });
                
                if (cachedWord) {
                    // Update analytics
                    await cachedWord.incrementSearchCount();
                    
                    // Return cached data
                    const formattedData = {
                        word: cachedWord.word,
                        phonetic: cachedWord.phonetic,
                        phoneticAudio: cachedWord.phoneticAudio,
                        origin: cachedWord.origin,
                        meanings: cachedWord.meanings,
                        sourceUrls: cachedWord.sourceUrls,
                        cached: true
                    };
                    
                    return res.json(formattedData);
                }
            } catch (modelError) {
                console.log('Word model not available, fetching directly from API');
            }
        }

        // Fetch from external API
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(sanitizedWord)}`;
        
        const apiResponse = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'LexiQuest/2.0'
            }
        });
        const data = await apiResponse.json();

        // Check if the response is ok
        if (!apiResponse.ok) {
            console.log(`Error fetching data for word "${sanitizedWord}":`, data);
            return res.status(apiResponse.status).json({ 
                error: data.message || 'Word not found',
                suggestions: data.suggestions || []
            });
        }

        // -- Data Transformation --
        const firstResult = data[0];
        
        // Find the first available phonetic text and audio
        const phonetic = firstResult.phonetics.find(p => p.text) || {};
        const phoneticText = phonetic.text || '';
        const phoneticAudio = firstResult.phonetics.find(p => p.audio)?.audio || '';

        const formattedData = {
            word: firstResult.word,
            phonetic: phoneticText,
            phoneticAudio: phoneticAudio,
            origin: firstResult.origin || '',
            meanings: firstResult.meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions.slice(0, 3).map(def => ({
                    definition: def.definition,
                    example: def.example || '',
                    synonyms: def.synonyms || [],
                    antonyms: def.antonyms || []
                })),
                synonyms: meaning.synonyms || [],
                antonyms: meaning.antonyms || []
            })),
            sourceUrls: firstResult.sourceUrls || [],
            cached: false
        };

        // Cache the word data if database is connected
        if (isDbConnected) {
            try {
                const Word = require('./models/Word');
                const newWord = new Word({
                    word: sanitizedWord,
                    phonetic: phoneticText,
                    phoneticAudio: phoneticAudio,
                    origin: formattedData.origin,
                    meanings: formattedData.meanings,
                    sourceUrls: formattedData.sourceUrls,
                    searchCount: 1
                });
                await newWord.save();
            } catch (cacheError) {
                console.error('Error caching word:', cacheError);
                // Continue without caching - don't fail the request
            }
        }

        res.json(formattedData);
    } catch (error) {
        console.error(`Error fetching data for word "${sanitizedWord}":`, error);
        if (error.name === 'AbortError') {
            res.status(408).json({ error: 'Request timeout' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Demo endpoints for frontend compatibility
app.get('/api/analytics/word-of-the-day', (req, res) => {
    res.json({
        word: 'serendipity',
        phonetic: '/ˌser.ənˈdɪp.ɪ.ti/',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        isDefault: true
    });
});

app.get('/api/analytics/popular', (req, res) => {
    res.json([
        { word: 'serendipity', searchCount: 42 },
        { word: 'ephemeral', searchCount: 38 },
        { word: 'ubiquitous', searchCount: 35 },
        { word: 'mellifluous', searchCount: 31 },
        { word: 'petrichor', searchCount: 28 },
        { word: 'wanderlust', searchCount: 25 }
    ]);
});

// Auth endpoints (demo mode when DB not connected)
app.post('/api/auth/login', (req, res) => {
    if (!isDbConnected) {
        return res.status(503).json({ 
            error: 'Authentication not available. Database connection required.',
            demo: true
        });
    }
    // If DB is connected, this will be handled by the auth routes
    res.status(404).json({ error: 'Auth route not properly configured' });
});

app.post('/api/auth/register', (req, res) => {
    if (!isDbConnected) {
        return res.status(503).json({ 
            error: 'Registration not available. Database connection required.',
            demo: true
        });
    }
    // If DB is connected, this will be handled by the auth routes
    res.status(404).json({ error: 'Auth route not properly configured' });
});

// Words endpoints (demo mode when DB not connected)
app.get('/api/words/liked', (req, res) => {
    if (!isDbConnected) {
        return res.status(503).json({ 
            error: 'User features not available. Database connection required.',
            demo: true
        });
    }
    // If DB is connected, this will be handled by the words routes
    res.status(404).json({ error: 'Words route not properly configured' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

//Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${isDbConnected ? 'Connected to MongoDB Atlas' : 'Disconnected - Demo mode'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    });
});