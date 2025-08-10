//Import necessary packages
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
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

//---Routes---
app.get('/', (req, res) => {
    res.json({
        message: 'LexiQuest Backend is running!',
        version: '2.0.0',
        status: 'Demo Mode - No Database Required',
        endpoints: {
            search: '/api/search/:word',
            analytics: '/api/analytics/*'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mode: 'demo'
    });
});

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

// Demo analytics endpoints
app.get('/api/analytics/word-of-the-day', (req, res) => {
    const words = [
        { word: 'serendipity', phonetic: '/ˌser.ənˈdɪp.ɪ.ti/', definition: 'The occurrence and development of events by chance in a happy or beneficial way.' },
        { word: 'ephemeral', phonetic: '/ɪˈfem.ər.əl/', definition: 'Lasting for a very short time.' },
        { word: 'ubiquitous', phonetic: '/juːˈbɪk.wɪ.təs/', definition: 'Present, appearing, or found everywhere.' },
        { word: 'mellifluous', phonetic: '/məˈlɪf.lu.əs/', definition: 'Sweet or musical; pleasant to hear.' },
        { word: 'petrichor', phonetic: '/ˈpet.rɪ.kɔːr/', definition: 'A pleasant smell frequently accompanying the first rain after a long period of warm, dry weather.' }
    ];
    
    const todayWord = words[new Date().getDate() % words.length];
    res.json({
        ...todayWord,
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

// Dummy auth endpoints for demo
app.post('/api/auth/login', (req, res) => {
    res.status(503).json({ 
        error: 'Authentication is disabled in demo mode. This is a showcase version.',
        demo: true
    });
});

app.post('/api/auth/register', (req, res) => {
    res.status(503).json({ 
        error: 'Registration is disabled in demo mode. This is a showcase version.',
        demo: true
    });
});

app.get('/api/auth/me', (req, res) => {
    res.status(503).json({ 
        error: 'User features are disabled in demo mode.',
        demo: true
    });
});

// Dummy user features endpoints
app.get('/api/words/liked', (req, res) => {
    res.status(503).json({ 
        error: 'User features are disabled in demo mode.',
        demo: true
    });
});

app.post('/api/words/like', (req, res) => {
    res.status(503).json({ 
        error: 'User features are disabled in demo mode.',
        demo: true
    });
});

app.delete('/api/words/unlike/:word', (req, res) => {
    res.status(503).json({ 
        error: 'User features are disabled in demo mode.',
        demo: true
    });
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
    console.log(`Mode: Demo - No database required`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});