# 🚀 Pappy Learning Platform - Setup Guide

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A Supabase account** - [Sign up here](https://supabase.com/)
- **A code editor** (VS Code recommended)

## 🔧 Step-by-Step Setup

### Step 1: Verify Node.js Installation
Open your terminal/command prompt and check:
```bash
node --version
npm --version
```
You should see version numbers. If not, install Node.js first.

### Step 2: Set Up Supabase Database

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com/)
   - Click "Start your project"
   - Sign up/login with GitHub, Google, or email
   - Click "New Project"
   - Choose your organization
   - Enter project name: "Pappy Learning Platform"
   - Set a strong database password
   - Choose a region close to you
   - Click "Create new project"

2. **Wait for Project Setup:**
   - This takes 1-2 minutes
   - You'll see a progress indicator

3. **Get Your Supabase Credentials:**
   - Once ready, go to **Settings** → **API**
   - Copy these two values:
     - **Project URL** (looks like: `https://xyz.supabase.co`)
     - **anon public key** (long string starting with `eyJ...`)

### Step 3: Set Up Database Schema

1. **Open SQL Editor:**
   - In your Supabase dashboard, click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run Database Setup:**
   - Copy the entire content from `database-setup.sql` file
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter) 
   - Wait for all queries to complete (should show "Success" messages)

3. **Verify Tables Created:**
   - Go to **Table Editor** in the left sidebar
   - You should see 15 tables: users, worlds, missions, games, etc.

### Step 4: Configure Environment Variables

1. **Create Environment File:**
   ```bash
   # In your project directory
   cp .env.example .env
   ```

2. **Edit .env File:**
   Open `.env` file in your code editor and replace:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   PORT=3000
   ```

   Replace with your actual Supabase values from Step 2.

### Step 5: Install Dependencies

1. **Install Root Dependencies:**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Step 6: Start the Application

**Option A: Using the Startup Script (Recommended)**
```bash
./start.sh
```

**Option B: Manual Start**
```bash
npm start
```

### Step 7: Verify Everything Works

1. **Check Server Output:**
   You should see:
   ```
   ✅ Pappy Learning Platform Server running on http://localhost:3000
   🔗 Supabase connected: Yes
   🎮 Available routes:
      - Home: http://localhost:3000/
      - Science World: http://localhost:3000/science-world
      - Math Galaxy: http://localhost:3000/math-galaxy
      ...
   ```

2. **Test the Application:**
   - Open your browser
   - Go to `http://localhost:3000`
   - You should see the **login page** (this is now the default)

3. **Test the Complete User Flow:**
   - **Step 1**: Go to `http://localhost:3000/signup` to create a new account
   - **Step 2**: After signup, you'll be redirected to the login page
   - **Step 3**: Login with your credentials and get redirected to home page (`/home`)
   - **Alternative**: Use `http://localhost:3000/test-login.html` for quick testing

4. **Test API Endpoints:**
   - Go to `http://localhost:3000/api/worlds`
   - You should see JSON data with the 5 learning worlds

## 🎯 Quick Test Checklist

- [ ] Node.js and npm installed
- [ ] Supabase project created
- [ ] Database schema imported successfully
- [ ] .env file configured with correct credentials
- [ ] Dependencies installed (both root and backend)
- [ ] Server starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] API returns data at http://localhost:3000/api/worlds

## 🛠️ Development Mode

For development with auto-restart:
```bash
# Install nodemon globally
npm install -g nodemon

# Start in development mode
npm run dev
```

## 📱 Accessing Your Platform

Once running, you can access:
- **Login Page**: http://localhost:3000/ (default)
- **Signup Page**: http://localhost:3000/signup
- **Home Page**: http://localhost:3000/home
- **Science World**: http://localhost:3000/science-world
- **Math Galaxy**: http://localhost:3000/math-galaxy
- **History Land**: http://localhost:3000/history-land
- **Life Skills**: http://localhost:3000/life-skills
- **AI Future City**: http://localhost:3000/ai-future-city
- **Parents Corner**: http://localhost:3000/parents
- **Leaderboard**: http://localhost:3000/leaderboard

## 🔧 Troubleshooting

### Common Issues:

1. **"Port 3000 already in use"**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   # Or change PORT in .env file
   ```

2. **"Supabase connection failed"**
   - Check your .env file has correct SUPABASE_URL and SUPABASE_ANON_KEY
   - Verify your Supabase project is active

3. **"Module not found" errors**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   cd backend && rm -rf node_modules package-lock.json && npm install
   ```

4. **Database errors**
   - Make sure you ran the complete database-setup.sql
   - Check Supabase dashboard for any error messages

5. **Permission errors on macOS/Linux**
   ```bash
   chmod +x start.sh
   ```

## 🎮 Next Steps

Once everything is running:

1. **Test User Registration**: Try creating a test account
2. **Explore Learning Worlds**: Navigate through different subjects
3. **Test Games**: Try the interactive activities
4. **Check Parent Dashboard**: Test parent features
5. **Customize Content**: Add your own missions and games

## 📞 Need Help?

If you encounter issues:
1. Check the console output for error messages
2. Verify all steps were completed correctly
3. Check Supabase dashboard for database issues
4. Ensure all dependencies are installed

Your Pappy Learning Platform should now be running successfully! 🎉

