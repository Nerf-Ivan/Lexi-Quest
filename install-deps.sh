#!/bin/bash

echo "Installing LexiQuest Dependencies..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd lexi-quest-backend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "❌ Backend package.json not found"
    exit 1
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd lexi-quest-frontend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "❌ Frontend package.json not found"
    exit 1
fi

cd ..

echo
echo "🎉 All dependencies installed successfully!"
echo "You can now run the application using:"
echo "  ./start-dev.sh (Linux/Mac)"
echo "  start-dev.bat (Windows)"
echo