#!/bin/bash

echo "🚀 Setting up LexiQuest for GitHub..."
echo

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: LexiQuest - Professional Dictionary App

✨ Features:
- Full-stack dictionary application
- React frontend with dark mode
- Node.js/Express backend
- MongoDB Atlas integration
- JWT authentication
- Responsive design
- Professional UI/UX

🛠 Tech Stack:
- Frontend: React 19, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JWT
- Deployment: Vercel + Railway ready"

echo "✅ Git repository initialized and files committed!"
echo
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy the repository URL"
echo "3. Run: git remote add origin <your-repo-url>"
echo "4. Run: git branch -M main"
echo "5. Run: git push -u origin main"
echo
echo "🌐 Then deploy:"
echo "- Frontend: https://vercel.com (connect GitHub repo)"
echo "- Backend: https://railway.app (connect GitHub repo)"
echo