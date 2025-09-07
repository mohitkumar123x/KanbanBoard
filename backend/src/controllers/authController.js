const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');



exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      logger.error('Registration failed: Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.error(`Registration failed: Email ${email} already exists`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const tenantId = uuidv4();  // Generate tenant ID during registration for immediate isolation

    const user = new User({
      name,
      uid: uuidv4(),
      email: email.toLowerCase(),
      password,
      tenantId,  // Assign tenant ID
      registeredAt: new Date()
    });

    await user.save();
    logger.info(`User registered: ${email}, UID: ${user.uid}, Tenant ID: ${tenantId}`);
    res.status(201).json({ message: 'User registered successfully', uid: user.uid, tenantId: user.tenantId });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.error('Login failed: Missing required fields');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.error(`Login failed: User with email ${email} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    logger.info(`Password comparison for ${email}: ${isMatch}`);
    if (!isMatch) {
      logger.error(`Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, uid: user.uid, tenantId: user.tenantId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    logger.info(`User logged in: ${email}, UID: ${user.uid}, Tenant ID: ${user.tenantId}`);
    res.status(200).json({ message: 'Login successful', token, uid: user.uid, tenantId: user.tenantId });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('name email');
    if (!user) {
      logger.error(`User info failed: User ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`Fetched user info for ${userId}`);
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    logger.error(`Error fetching user info: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};