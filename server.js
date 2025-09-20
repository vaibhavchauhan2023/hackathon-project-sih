const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'login.html'));
});

// Serve main home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'signup.html'));
});

// Authentication APIs
app.post('/api/signup', async (req, res) => {
  const { email, password, username, firstName, lastName, dateOfBirth } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Create user profile in our users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: email,
          username: username,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth
        }]);
      
      if (profileError) {
        console.log('Profile creation error:', profileError);
      }
    }
    
    res.json({ message: 'User created successfully', user: data.user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Login successful', 
      user: data.user,
      token: data.session.access_token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User Data (Protected Route)
app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get extended user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    res.json({ user: userData || user });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Learning Progress APIs
app.post('/api/progress/mission', async (req, res) => {
  const { userId, missionId, score, completionPercentage, timeSpent } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        mission_id: missionId,
        score: score,
        completion_percentage: completionPercentage,
        time_spent: timeSpent,
        status: completionPercentage === 100 ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Progress saved successfully', data });
  } catch (err) {
    console.error('Progress save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/progress/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        missions (
          title,
          world_id,
          worlds (name)
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ progress: data });
  } catch (err) {
    console.error('Progress fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Game Score APIs
app.post('/api/scores/save', async (req, res) => {
  const { userId, gameId, score, maxPossibleScore, timeTaken, gameData } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([{
        user_id: userId,
        game_id: gameId,
        score: score,
        max_possible_score: maxPossibleScore,
        time_taken: timeTaken,
        game_data: gameData
      }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Score saved successfully', data });
  } catch (err) {
    console.error('Score save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Worlds and Missions APIs
app.get('/api/worlds', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('is_active', true)
      .order('order_index');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ worlds: data });
  } catch (err) {
    console.error('Worlds fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/worlds/:worldId/missions', async (req, res) => {
  const { worldId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('world_id', worldId)
      .eq('is_active', true)
      .order('order_index');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ missions: data });
  } catch (err) {
    console.error('Missions fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Badges APIs
app.post('/api/badges/award', async (req, res) => {
  const { userId, badgeId } = req.body;
  
  try {
    // Check if user already has this badge
    const { data: existing } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId);
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Badge already earned' });
    }
    
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{
        user_id: userId,
        badge_id: badgeId
      }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Badge awarded successfully', data });
  } catch (err) {
    console.error('Badge award error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/badges/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        earned_at,
        badges (
          name,
          description,
          icon_url,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ badges: data });
  } catch (err) {
    console.error('Badges fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Page Routes

app.get('/science-world', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'science-world.html'));
});

app.get('/math-galaxy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'math-galaxy.html'));
});

app.get('/history-land', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'history-land.html'));
});

app.get('/life-skills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'life-skills.html'));
});

app.get('/interactive-story', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'interactive_story.html'));
});

app.get('/parents', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'parents.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'leaderboard.html'));
});

// Water cycle specific route
app.get('/water-cycle', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Frontend', 'web pages', 'water.html'));
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
  console.log(`   - Login Page: http://localhost:${PORT}/ (default)`);
  console.log(`   - Signup Page: http://localhost:${PORT}/signup`);
  console.log(`   - Home Page: http://localhost:${PORT}/home`);
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