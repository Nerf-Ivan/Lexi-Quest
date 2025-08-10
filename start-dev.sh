#!/bin/bash

echo "Starting LexiQuest Development Environment..."
echo

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Starting Backend Server..."
cd lexi-quest-backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!

cd ..

echo "Starting Frontend Server..."
cd lexi-quest-frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup background processes
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Wait for user to stop
wait