const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const resources = await Resource.find({ uploader: req.params.id }).sort({ createdAt: -1 });
        res.json({ user, resources });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile
router.put('/profile/update', protect, async (req, res) => {
    try {
        const { name, bio, department, year, college } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, bio, department, year, college },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get saved resources
router.get('/saved/resources', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedResources',
            populate: { path: 'uploader', select: 'name avatar' }
        });
        res.json(user.savedResources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Leaderboard
router.get('/leaderboard/top', async (req, res) => {
    try {
        const users = await User.find().sort({ reputation: -1 }).limit(10).select('name college reputation uploadCount badges avatar');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
