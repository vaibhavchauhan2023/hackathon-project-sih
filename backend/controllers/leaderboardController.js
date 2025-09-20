const supabase = require('../models/supabaseClient');

// Get Weekly Leaderboard
const getWeeklyLeaderboard = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('leaderboards')
      .select(`
        rank,
        total_xp,
        missions_completed,
        users (
          username,
          avatar_url,
          level
        )
      `)
      .eq('leaderboard_type', 'weekly')
      .gte('period_start', startOfWeek.toISOString().split('T')[0])
      .lte('period_end', endOfWeek.toISOString().split('T')[0])
      .order('rank', { ascending: true })
      .limit(50);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ leaderboard: data });
  } catch (err) {
    console.error('Weekly leaderboard fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Monthly Leaderboard
const getMonthlyLeaderboard = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
      .from('leaderboards')
      .select(`
        rank,
        total_xp,
        missions_completed,
        users (
          username,
          avatar_url,
          level
        )
      `)
      .eq('leaderboard_type', 'monthly')
      .gte('period_start', startOfMonth.toISOString().split('T')[0])
      .lte('period_end', endOfMonth.toISOString().split('T')[0])
      .order('rank', { ascending: true })
      .limit(50);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ leaderboard: data });
  } catch (err) {
    console.error('Monthly leaderboard fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All-Time Leaderboard
const getAllTimeLeaderboard = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        username,
        avatar_url,
        level,
        total_xp,
        coins
      `)
      .eq('is_active', true)
      .order('total_xp', { ascending: false })
      .limit(100);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Add rank to each user
    const leaderboard = data.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    res.json({ leaderboard });
  } catch (err) {
    console.error('All-time leaderboard fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get User's Rank
const getUserRank = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get user's total XP
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_xp')
      .eq('id', userId)
      .single();
    
    if (userError) {
      return res.status(400).json({ error: userError.message });
    }
    
    // Count users with higher XP
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt('total_xp', user.total_xp)
      .eq('is_active', true);
    
    if (countError) {
      return res.status(400).json({ error: countError.message });
    }
    
    const rank = count + 1;
    
    res.json({ rank, totalXp: user.total_xp });
  } catch (err) {
    console.error('User rank fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Leaderboard (Internal function - called when user completes missions)
const updateLeaderboard = async (userId) => {
  try {
    // Get user's current stats
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_xp, level')
      .eq('id', userId)
      .single();
    
    if (userError) return;
    
    // Count completed missions
    const { count: missionsCompleted, error: missionsError } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    if (missionsError) return;
    
    // Update weekly leaderboard
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    await supabase
      .from('leaderboards')
      .upsert({
        user_id: userId,
        leaderboard_type: 'weekly',
        period_start: startOfWeek.toISOString().split('T')[0],
        period_end: endOfWeek.toISOString().split('T')[0],
        total_xp: user.total_xp,
        missions_completed: missionsCompleted,
        updated_at: new Date().toISOString()
      });
    
    // Update monthly leaderboard
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    await supabase
      .from('leaderboards')
      .upsert({
        user_id: userId,
        leaderboard_type: 'monthly',
        period_start: startOfMonth.toISOString().split('T')[0],
        period_end: endOfMonth.toISOString().split('T')[0],
        total_xp: user.total_xp,
        missions_completed: missionsCompleted,
        updated_at: new Date().toISOString()
      });
    
  } catch (err) {
    console.error('Leaderboard update error:', err);
  }
};

module.exports = {
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getAllTimeLeaderboard,
  getUserRank,
  updateLeaderboard
};
