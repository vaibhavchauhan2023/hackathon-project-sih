-- Pappy Learning Platform Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Users/Students Table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    parent_email VARCHAR(255)
);

-- 2. Worlds/Subjects Table
CREATE TABLE worlds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    theme_color VARCHAR(7), -- hex color
    icon_url TEXT,
    background_image TEXT,
    order_index INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Missions/Lessons Table
CREATE TABLE missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    world_id UUID REFERENCES worlds(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    story_content JSONB, -- stores interactive story data
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    xp_reward INTEGER DEFAULT 10,
    coin_reward INTEGER DEFAULT 5,
    order_index INTEGER,
    unlock_requirements JSONB, -- prerequisite missions
    estimated_duration INTEGER, -- in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Games/Activities Table
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- 'drag_drop', 'quiz', 'motion', 'story_choice'
    game_data JSONB NOT NULL, -- game configuration and content
    max_score INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 70,
    time_limit INTEGER, -- in seconds
    order_index INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. User Progress Table
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    score INTEGER,
    completion_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, mission_id)
);

-- 6. Game Scores Table
CREATE TABLE game_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_possible_score INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    attempts INTEGER DEFAULT 1,
    game_data JSONB, -- store user's answers/choices
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Badges/Achievements Table
CREATE TABLE badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    badge_type VARCHAR(50), -- 'completion', 'score', 'streak', 'special'
    requirements JSONB, -- conditions to earn the badge
    xp_bonus INTEGER DEFAULT 0,
    coin_bonus INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. User Badges Table
CREATE TABLE user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- 9. Daily Challenges Table
CREATE TABLE daily_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_date DATE NOT NULL,
    challenge_type VARCHAR(50), -- 'riddle', 'quiz', 'activity'
    challenge_data JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 20,
    coin_reward INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(challenge_date)
);

-- 10. User Challenge Progress Table
CREATE TABLE user_daily_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, challenge_id)
);

-- 11. Avatar Items Table
CREATE TABLE avatar_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'hair', 'clothing', 'accessories', 'backgrounds'
    image_url TEXT NOT NULL,
    cost INTEGER DEFAULT 0, -- cost in coins
    unlock_requirement JSONB, -- level, badge, or mission requirement
    rarity VARCHAR(20) DEFAULT 'common',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. User Avatar Items Table
CREATE TABLE user_avatar_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES avatar_items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT false,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- 13. Leaderboards Table
CREATE TABLE leaderboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'all_time'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_xp INTEGER DEFAULT 0,
    missions_completed INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. Stories Table
CREATE TABLE stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    story_data JSONB NOT NULL, -- interactive story structure
    choices JSONB, -- available choices at decision points
    outcomes JSONB, -- consequences of choices
    moral_lesson TEXT,
    age_group VARCHAR(20), -- '6-8', '9-11', '12-14'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. User Story Progress Table
CREATE TABLE user_story_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    current_scene INTEGER DEFAULT 1,
    choices_made JSONB DEFAULT '[]',
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, story_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_missions_world_id ON missions(world_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_mission_id ON user_progress(mission_id);
CREATE INDEX idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_leaderboards_type_period ON leaderboards(leaderboard_type, period_start, period_end);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_story_progress ENABLE ROW LEVEL SECURITY;

-- Sample data insertion queries

-- Insert sample worlds
INSERT INTO worlds (name, slug, description, theme_color, order_index) VALUES
('Science World', 'science-world', 'Explore the wonders of science, space, and environment', '#4CAF50', 1),
('History Land', 'history-land', 'Journey through time and learn about civilizations', '#FF9800', 2),
('Math Galaxy', 'math-galaxy', 'Master numbers and solve mathematical puzzles', '#2196F3', 3),
('Life Skills Village', 'life-skills-village', 'Learn essential life skills and values', '#9C27B0', 4),
('AI & Future City', 'ai-future-city', 'Discover technology and digital citizenship', '#607D8B', 5);

-- Insert sample badges
INSERT INTO badges (name, description, badge_type, xp_bonus, coin_bonus) VALUES
('First Steps', 'Complete your first mission', 'completion', 50, 25),
('Math Wizard', 'Complete 5 math missions', 'completion', 100, 50),
('Science Explorer', 'Complete 5 science missions', 'completion', 100, 50),
('Kindness Hero', 'Complete all kindness missions', 'completion', 200, 100),
('Perfect Score', 'Get 100% on any game', 'score', 75, 30),
('Speed Runner', 'Complete a mission in under 5 minutes', 'special', 150, 75);

-- Insert sample avatar items
INSERT INTO avatar_items (name, category, image_url, cost) VALUES
('Cool Sunglasses', 'accessories', '/images/avatars/sunglasses.png', 50),
('Superhero Cape', 'clothing', '/images/avatars/cape.png', 100),
('Space Helmet', 'accessories', '/images/avatars/helmet.png', 75),
('Wizard Hat', 'accessories', '/images/avatars/wizard-hat.png', 80),
('Science Lab Coat', 'clothing', '/images/avatars/lab-coat.png', 60);

-- Create a function to increment user stats
CREATE OR REPLACE FUNCTION increment_user_stats(
    user_id UUID,
    xp_increment INTEGER,
    coin_increment INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET 
        total_xp = total_xp + xp_increment,
        coins = coins + coin_increment,
        level = CASE 
            WHEN (total_xp + xp_increment) >= (level + 1) * 100 
            THEN level + 1 
            ELSE level 
        END,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
