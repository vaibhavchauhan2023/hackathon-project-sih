const supabase = require('../models/supabaseClient');

// User Registration
const signup = async (req, res) => {
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
};

// User Login
const login = async (req, res) => {
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
};

// Get User Data (Protected Route)
const getUser = async (req, res) => {
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
};

// Update User Profile
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, firstName, lastName, avatarUrl } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        username,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Profile updated successfully', user: data[0] });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateProfile,
  logout
};
