# LexiQuest Deployment Guide

## 🚀 Quick Deploy Links

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/lexi-quest&project-name=lexi-quest-frontend&repository-name=lexi-quest)

### Backend (Railway)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/lexi-quest)

## 📋 Deployment Steps

### 1. Backend Deployment (Railway)

1. **Sign up** at [Railway.app](https://railway.app)
2. **Connect GitHub** and select your repository
3. **Select** the `lexi-quest-backend` folder
4. **Set Environment Variables**:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
5. **Deploy** - Railway will automatically build and deploy

### 2. Frontend Deployment (Vercel)

1. **Sign up** at [Vercel.com](https://vercel.com)
2. **Import** your GitHub repository
3. **Select** the `lexi-quest-frontend` folder as root directory
4. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-domain.railway.app
   REACT_APP_NAME=LexiQuest
   REACT_APP_VERSION=2.0.0
   ```
5. **Deploy** - Vercel will build and deploy automatically

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lexiquest
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.railway.app
REACT_APP_NAME=LexiQuest
REACT_APP_VERSION=2.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## 🌐 Custom Domains (Optional)

Both Vercel and Railway support custom domains:
- **Vercel**: Add domain in project settings
- **Railway**: Add domain in service settings

## 📊 Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Railway**: Resource usage and logs in dashboard
- **MongoDB Atlas**: Database monitoring and alerts

## 🔒 Security Checklist

- ✅ Environment variables set correctly
- ✅ CORS configured for production domains
- ✅ JWT secret is secure and unique
- ✅ MongoDB Atlas IP whitelist configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers active

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update FRONTEND_URL in backend env
2. **Database Connection**: Check MongoDB Atlas connection string
3. **Build Failures**: Ensure all dependencies are in package.json
4. **Environment Variables**: Double-check all required vars are set

### Logs:
- **Railway**: View logs in dashboard
- **Vercel**: Check function logs in dashboard
- **MongoDB**: Monitor in Atlas dashboard