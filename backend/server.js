const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const parentRoutes = require('./routes/parentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/parents', parentRoutes);

// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/login.html'));
});

// Serve main home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/signup.html'));
});

// Page Routes

app.get('/science-world', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/science-world.html'));
});

app.get('/math-galaxy', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/math-galaxy.html'));
});

app.get('/history-land', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/history-land.html'));
});

app.get('/life-skills', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/life-skills.html'));
});

app.get('/ai-future-city', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/ai-future-city.html'));
});

app.get('/interactive-story', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/interactive_story.html'));
});

app.get('/parents', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/parents.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/leaderboard.html'));
});

// Water cycle specific route
app.get('/water-cycle', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Frontend/web pages/water.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Pappy Learning Platform Server running on http://localhost:${PORT}`);
  console.log(`🔗 Supabase connected: ${process.env.SUPABASE_URL ? 'Yes' : 'No'}`);
  console.log(`🎮 Available routes:`);
  console.log(`   - Home: http://localhost:${PORT}/`);
  console.log(`   - Science World: http://localhost:${PORT}/science-world`);
  console.log(`   - Math Galaxy: http://localhost:${PORT}/math-galaxy`);
  console.log(`   - History Land: http://localhost:${PORT}/history-land`);
  console.log(`   - Life Skills: http://localhost:${PORT}/life-skills`);
  console.log(`   - AI Future City: http://localhost:${PORT}/ai-future-city`);
  console.log(`   - Parents Corner: http://localhost:${PORT}/parents`);
  console.log(`   - Leaderboard: http://localhost:${PORT}/leaderboard`);
  console.log(`   - Water Cycle: http://localhost:${PORT}/water-cycle`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   - Auth: http://localhost:${PORT}/api/auth/*`);
  console.log(`   - Games: http://localhost:${PORT}/api/games/*`);
  console.log(`   - Leaderboard: http://localhost:${PORT}/api/leaderboard/*`);
  console.log(`   - Parents: http://localhost:${PORT}/api/parents/*`);
});
