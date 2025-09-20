const supabase = require('../models/supabaseClient');

// Get Child's Progress Summary
const getChildProgress = async (req, res) => {
  const { childId } = req.params;
  
  try {
    // Get child's basic info
    const { data: child, error: childError } = await supabase
      .from('users')
      .select('username, level, total_xp, coins, created_at')
      .eq('id', childId)
      .single();
    
    if (childError) {
      return res.status(400).json({ error: childError.message });
    }
    
    // Get progress by world
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select(`
        status,
        completion_percentage,
        time_spent,
        missions (
          title,
          worlds (name, theme_color)
        )
      `)
      .eq('user_id', childId);
    
    if (progressError) {
      return res.status(400).json({ error: progressError.message });
    }
    
    // Get badges earned
    const { data: badges, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        earned_at,
        badges (name, description, icon_url)
      `)
      .eq('user_id', childId)
      .order('earned_at', { ascending: false });
    
    if (badgesError) {
      return res.status(400).json({ error: badgesError.message });
    }
    
    // Calculate statistics
    const totalMissions = progress.length;
    const completedMissions = progress.filter(p => p.status === 'completed').length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0);
    
    // Group by world
    const worldProgress = {};
    progress.forEach(p => {
      const worldName = p.missions?.worlds?.name || 'Unknown';
      if (!worldProgress[worldName]) {
        worldProgress[worldName] = {
          worldName,
          themeColor: p.missions?.worlds?.theme_color,
          totalMissions: 0,
          completedMissions: 0,
          totalTimeSpent: 0
        };
      }
      worldProgress[worldName].totalMissions++;
      if (p.status === 'completed') {
        worldProgress[worldName].completedMissions++;
      }
      worldProgress[worldName].totalTimeSpent += p.time_spent || 0;
    });
    
    res.json({
      child,
      summary: {
        totalMissions,
        completedMissions,
        completionRate: totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0,
        totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
        badgesEarned: badges.length
      },
      worldProgress: Object.values(worldProgress),
      recentBadges: badges.slice(0, 5)
    });
  } catch (err) {
    console.error('Child progress fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Child's Learning Activity
const getChildActivity = async (req, res) => {
  const { childId } = req.params;
  const { days = 7 } = req.query;
  
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get recent progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select(`
        status,
        completion_percentage,
        time_spent,
        completed_at,
        missions (
          title,
          worlds (name)
        )
      `)
      .eq('user_id', childId)
      .gte('updated_at', startDate.toISOString())
      .order('updated_at', { ascending: false });
    
    if (progressError) {
      return res.status(400).json({ error: progressError.message });
    }
    
    // Get recent game scores
    const { data: scores, error: scoresError } = await supabase
      .from('game_scores')
      .select(`
        score,
        max_possible_score,
        time_taken,
        created_at,
        games (
          name,
          game_type,
          missions (
            title,
            worlds (name)
          )
        )
      `)
      .eq('user_id', childId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (scoresError) {
      return res.status(400).json({ error: scoresError.message });
    }
    
    // Get daily challenges completed
    const { data: challenges, error: challengesError } = await supabase
      .from('user_daily_challenges')
      .select(`
        completed,
        score,
        completed_at,
        daily_challenges (title, description)
      `)
      .eq('user_id', childId)
      .eq('completed', true)
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: false });
    
    if (challengesError) {
      return res.status(400).json({ error: challengesError.message });
    }
    
    res.json({
      progress,
      scores,
      challenges
    });
  } catch (err) {
    console.error('Child activity fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Learning Recommendations
const getLearningRecommendations = async (req, res) => {
  const { childId } = req.params;
  
  try {
    // Get child's current level and progress
    const { data: child, error: childError } = await supabase
      .from('users')
      .select('level, total_xp')
      .eq('id', childId)
      .single();
    
    if (childError) {
      return res.status(400).json({ error: childError.message });
    }
    
    // Get child's completed missions
    const { data: completedMissions, error: completedError } = await supabase
      .from('user_progress')
      .select('mission_id')
      .eq('user_id', childId)
      .eq('status', 'completed');
    
    if (completedError) {
      return res.status(400).json({ error: completedError.message });
    }
    
    const completedMissionIds = completedMissions.map(m => m.mission_id);
    
    // Get recommended missions based on level and not completed
    const { data: recommendedMissions, error: missionsError } = await supabase
      .from('missions')
      .select(`
        id,
        title,
        description,
        difficulty_level,
        xp_reward,
        worlds (name, theme_color)
      `)
      .eq('is_active', true)
      .lte('difficulty_level', child.level + 1)
      .not('id', 'in', `(${completedMissionIds.join(',')})`)
      .order('difficulty_level')
      .limit(5);
    
    if (missionsError) {
      return res.status(400).json({ error: missionsError.message });
    }
    
    // Get available badges
    const { data: availableBadges, error: badgesError } = await supabase
      .from('badges')
      .select('name, description, requirements')
      .eq('is_active', true)
      .limit(3);
    
    if (badgesError) {
      return res.status(400).json({ error: badgesError.message });
    }
    
    res.json({
      recommendedMissions,
      availableBadges,
      currentLevel: child.level,
      nextLevelXp: (child.level + 1) * 100 // Example: 100 XP per level
    });
  } catch (err) {
    console.error('Learning recommendations fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Parent Settings
const updateParentSettings = async (req, res) => {
  const { childId } = req.params;
  const { dailyTimeLimit, contentFilter, notifications } = req.body;
  
  try {
    // This would typically be stored in a separate parent_settings table
    // For now, we'll store it in the user's metadata or a separate table
    const { data, error } = await supabase
      .from('users')
      .update({
        // Assuming we add these fields to the users table
        daily_time_limit: dailyTimeLimit,
        content_filter: contentFilter,
        parent_notifications: notifications,
        updated_at: new Date().toISOString()
      })
      .eq('id', childId)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Parent settings updated successfully', data });
  } catch (err) {
    console.error('Parent settings update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Parent Dashboard Summary
const getParentDashboard = async (req, res) => {
  const { parentEmail } = req.params;
  
  try {
    // Get all children associated with this parent
    const { data: children, error: childrenError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        level,
        total_xp,
        coins,
        created_at,
        is_active
      `)
      .eq('parent_email', parentEmail)
      .eq('is_active', true);
    
    if (childrenError) {
      return res.status(400).json({ error: childrenError.message });
    }
    
    // Get summary for each child
    const childrenSummary = await Promise.all(
      children.map(async (child) => {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('status')
          .eq('user_id', child.id);
        
        const completedMissions = progress?.filter(p => p.status === 'completed').length || 0;
        const totalMissions = progress?.length || 0;
        
        return {
          ...child,
          completedMissions,
          totalMissions,
          completionRate: totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
        };
      })
    );
    
    res.json({
      children: childrenSummary,
      totalChildren: children.length,
      totalXp: children.reduce((sum, child) => sum + child.total_xp, 0)
    });
  } catch (err) {
    console.error('Parent dashboard fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getChildProgress,
  getChildActivity,
  getLearningRecommendations,
  updateParentSettings,
  getParentDashboard
};
