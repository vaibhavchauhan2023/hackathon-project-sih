const supabase = require('../models/supabaseClient');

// Save Mission Progress
const saveMissionProgress = async (req, res) => {
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
    
    // Update user's total XP and coins if mission completed
    if (completionPercentage === 100) {
      const { data: mission } = await supabase
        .from('missions')
        .select('xp_reward, coin_reward')
        .eq('id', missionId)
        .single();
      
      if (mission) {
        await supabase.rpc('increment_user_stats', {
          user_id: userId,
          xp_increment: mission.xp_reward,
          coin_increment: mission.coin_reward
        });
      }
    }
    
    res.json({ message: 'Progress saved successfully', data });
  } catch (err) {
    console.error('Progress save error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get User Progress
const getUserProgress = async (req, res) => {
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
};

// Save Game Score
const saveGameScore = async (req, res) => {
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
};

// Get Game Scores for User
const getUserGameScores = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select(`
        *,
        games (
          name,
          game_type,
          missions (
            title,
            worlds (name)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ scores: data });
  } catch (err) {
    console.error('Game scores fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Worlds
const getWorlds = async (req, res) => {
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
};

// Get Missions for a World
const getWorldMissions = async (req, res) => {
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
};

// Get Games for a Mission
const getMissionGames = async (req, res) => {
  const { missionId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('mission_id', missionId)
      .eq('is_active', true)
      .order('order_index');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ games: data });
  } catch (err) {
    console.error('Games fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Award Badge
const awardBadge = async (req, res) => {
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
};

// Get User Badges
const getUserBadges = async (req, res) => {
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
};

// Get Daily Challenge
const getDailyChallenge = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ challenge: data });
  } catch (err) {
    console.error('Daily challenge fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Complete Daily Challenge
const completeDailyChallenge = async (req, res) => {
  const { userId, challengeId, score } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('user_daily_challenges')
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        completed: true,
        score: score,
        completed_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Daily challenge completed successfully', data });
  } catch (err) {
    console.error('Daily challenge completion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  saveMissionProgress,
  getUserProgress,
  saveGameScore,
  getUserGameScores,
  getWorlds,
  getWorldMissions,
  getMissionGames,
  awardBadge,
  getUserBadges,
  getDailyChallenge,
  completeDailyChallenge
};
