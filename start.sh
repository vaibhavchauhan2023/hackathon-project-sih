#!/bin/bash

# Pappy Learning Platform Startup Script
echo "🎮 Starting Pappy Learning Platform..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your Supabase credentials before running again."
    echo "   Required: SUPABASE_URL and SUPABASE_ANON_KEY"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if backend node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start the server
echo "🚀 Starting server..."
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
