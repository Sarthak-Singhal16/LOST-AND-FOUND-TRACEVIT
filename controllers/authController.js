// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Traditional Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with that email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Traditional Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });
    
    // Check the user role and prepare the appropriate response.
    if (user.role === 'master') {
      // For master users: send an admin greeting and set redirect to master.html.
      res.json({
        message: 'Hello Admin',
        userId: user._id,
        name: user.name,
        role: user.role,
        redirect: 'master.html'
      });
    } else {
      // For regular users: send normal login success response with dashboard redirect.
      res.json({
        message: 'Login successful',
        userId: user._id,
        name: user.name,
        role: user.role,
        redirect: 'dashboard.html'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

