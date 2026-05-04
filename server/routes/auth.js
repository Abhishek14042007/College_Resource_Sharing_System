const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, college, department, year } = req.body;
        if (!name || !email || !password || !college) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            college,
            department: department || '',
            year: year || '1st',
            avatar: '',
            bio: '',
            savedResources: [],
            badges: [],
            uploadCount: 0,
            reputation: 0
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
            department: user.department,
            year: user.year,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
            department: user.department,
            year: user.year,
            avatar: user.avatar,
            bio: user.bio,
            reputation: user.reputation,
            uploadCount: user.uploadCount,
            badges: user.badges,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get current user
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
