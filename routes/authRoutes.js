const express = require('express');
const bcrypt = require('bcryptjs'); // Change from 'bcrypt' to 'bcryptjs'
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const ADMIN_KEY = 'SCAHS23';

// User sign-up
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, staffId } = req.body;

  if (!firstName || !lastName || !email || !password || !staffId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const StaffId = await User.findOne({ staffId });
    const existingFirstName = await User.findOne({ firstName });

    if (StaffId) {
      return res.status(400).json({ message: 'Staff ID already exists' });
    } else if (existingFirstName) {
      return res.status(400).json({ message: 'Name already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Use bcryptjs hash method
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      staffId,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Use bcryptjs compare method
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'me@dev123', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin sign-up
router.post('/admin/signup', async (req, res) => {
  const { firstName, lastName, email, password, staffId, adminKey } = req.body;

  console.log('Received adminKey:', adminKey);
  console.log('Expected ADMIN_KEY:', ADMIN_KEY);

  if (!firstName || !lastName || !email || !password || !staffId || !adminKey) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (adminKey !== ADMIN_KEY) {
    return res.status(400).json({ message: 'Invalid admin key' });
  }

  try {
    const existingUser = await User.findOne({ staffId });
    if (existingUser) {
      return res.status(400).json({ message: 'Staff ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Use bcryptjs hash method
    const newAdmin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
      staffId,
      adminKey, // Store the admin key
    });
    return res.status(201).json(newAdmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  const { email, password, adminKey } = req.body;

  console.log('Received adminKey:', adminKey);
  console.log('Expected ADMIN_KEY:', ADMIN_KEY);

  if (!email || !password || !adminKey) {
    return res
      .status(400)
      .json({ message: 'Email, password, and admin key are required' });
  }

  if (adminKey !== ADMIN_KEY) {
    return res.status(400).json({ message: 'Invalid admin key' });
  }

  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password); // Use bcryptjs compare method
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, 'me@dev123', {
      expiresIn: '1h',
    });

    return res.status(200).json({ token, admin });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Include all fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
