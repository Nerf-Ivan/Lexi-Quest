# LexiQuest - Professional Dictionary Application

LexiQuest is a modern, full-stack dictionary application that helps users expand their vocabulary through an intuitive and feature-rich interface. Built with React and Node.js, it offers comprehensive word definitions, user accounts, favorites management, and analytics.

## 🌐 Live Demo

- **Frontend**: [https://lexi-quest.vercel.app](https://lexi-quest.vercel.app) *(Update with your actual URL)*
- **Backend API**: [https://lexi-quest-backend.railway.app](https://lexi-quest-backend.railway.app) *(Update with your actual URL)*

## 🚀 Quick Deploy

[![Deploy Frontend](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nerf-Ivan/lexi-quest)
[![Deploy Backend](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Nerf-Ivan/lexi-quest)

## 🚀 Features

### Core Features
- **Advanced Word Search**: Search for word definitions with detailed meanings, pronunciations, and examples
- **Audio Pronunciations**: Listen to correct pronunciations when available
- **User Authentication**: Secure registration and login system with JWT tokens
- **Favorites Management**: Save and organize your favorite words
- **Search History**: Track your learning journey with search history
- **Word of the Day**: Discover new words daily
- **Popular Words**: See trending words searched by the community

### Professional Features
- **Caching System**: Intelligent word caching for improved performance
- **Analytics Dashboard**: Track user engagement and popular words
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Rate limiting, input validation, and secure authentication
- **Performance**: Optimized API calls and efficient data management

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Validator** for input validation

### Frontend
- **React 19** with Hooks
- **Tailwind CSS** for styling
- **Modern ES6+** JavaScript
- **Responsive Design** principles
- **Error Boundaries** for error handling

### External APIs
- **Dictionary API** (dictionaryapi.dev) for word definitions

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd lexi-quest-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
# Database
MONGO_URI=mongodb://localhost:27017/lexiquest
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/lexiquest

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd lexi-quest-frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured for local development. Modify if needed:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=LexiQuest
REACT_APP_VERSION=2.0.0
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🚀 Usage

### For Users

1. **Registration**: Create a new account with email and password
2. **Login**: Sign in to access personalized features
3. **Search Words**: Use the search bar to find word definitions
4. **Save Favorites**: Click the heart icon to save words to your favorites
5. **View History**: Access your search history from your profile
6. **Explore**: Check out the word of the day and popular words

### For Developers

#### API Endpoints

**Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

**Words**
- `GET /api/search/:word` - Search for a word definition
- `POST /api/words/like` - Add word to favorites
- `DELETE /api/words/unlike/:word` - Remove word from favorites
- `GET /api/words/liked` - Get user's favorite words
- `POST /api/words/search-history` - Add to search history
- `GET /api/words/search-history` - Get search history
- `GET /api/words/stats` - Get user statistics

**Analytics**
- `GET /api/analytics/popular` - Get popular words
- `GET /api/analytics/trending` - Get trending words
- `GET /api/analytics/word-of-the-day` - Get word of the day
- `GET /api/analytics/stats` - Get platform statistics

## 🏗 Project Structure

```
lexi-quest/
├── lexi-quest-backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Word.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── words.js
│   │   └── analytics.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── lexi-quest-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ErrorBoundary.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── FavoritesPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=LexiQuest
REACT_APP_VERSION=2.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
3. Update CORS settings for production frontend URL
4. Deploy using your platform's deployment process

### Frontend Deployment (Netlify/Vercel)

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting platform
3. Update `REACT_APP_API_URL` to point to your production backend

## 🧪 Testing

### Backend Testing
```bash
cd lexi-quest-backend
npm test
```

### Frontend Testing
```bash
cd lexi-quest-frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Dictionary API](https://dictionaryapi.dev/) for providing word definitions
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [MongoDB](https://www.mongodb.com/) for the database

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/lexi-quest/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

## 🔮 Future Enhancements

- [x] Dark mode support ✅ **COMPLETED**
- [ ] Offline functionality with service workers
- [ ] Word pronunciation practice
- [ ] Vocabulary quizzes and games
- [ ] Social features (word sharing)
- [ ] Mobile app (React Native)
- [ ] Multiple language support
- [ ] Vocabulary quizzes and games
- [ ] Social features (word sharing, user following)
- [ ] Mobile app (React Native)
- [ ] Multiple language support
- [ ] Advanced search filters
- [ ] Word etymology and historical usage
- [ ] Integration with learning management systems

---

**LexiQuest** - Expand your vocabulary, one word at a time! 📚✨
