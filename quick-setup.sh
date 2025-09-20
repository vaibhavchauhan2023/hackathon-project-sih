#!/bin/bash

# Pappy Learning Platform - Quick Setup Script
echo "🎮 Pappy Learning Platform - Quick Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: You need to configure your Supabase credentials!"
    echo "   1. Go to https://supabase.com/ and create a project"
    echo "   2. Get your Project URL and anon key from Settings → API"
    echo "   3. Edit the .env file with your credentials:"
    echo "      SUPABASE_URL=your_project_url"
    echo "      SUPABASE_ANON_KEY=your_anon_key"
    echo ""
    echo "   4. Run the database-setup.sql in your Supabase SQL Editor"
    echo ""
    read -p "Press Enter when you've configured .env file..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "   Installing root dependencies..."
npm install

echo "   Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "🚀 Starting the server..."
echo "   Open http://localhost:3000 in your browser"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start

