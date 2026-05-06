const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Resource = require('../models/Resource');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage (files will be uploaded to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Get all resources (with filters)
router.get('/', async (req, res) => {
    try {
        const { search, category, type, college, department, semester, page = 1, limit = 12, sort = 'newest' } = req.query;
        const query = {};

        if (search) query.$text = { $search: search };
        if (category) query.category = category;
        if (type) query.type = type;
        if (college) query.college = { $regex: college, $options: 'i' };
        if (department) query.department = department;
        if (semester) query.semester = semester;

        let sortOption = { createdAt: -1 };
        if (sort === 'popular') sortOption = { downloads: -1 };

        const total = await Resource.countDocuments(query);
        let resources = await Resource.find(query)
            .populate('uploader', 'name avatar college')
            .sort(sortOption)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        if (sort === 'likes') {
            resources = resources.sort((a, b) => (b.likes.length || 0) - (a.likes.length || 0));
        }

        res.json({ resources, total, pages: Math.ceil(total / limit), page: parseInt(page) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single resource (with view increment)
router.get('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        // Increment views
        resource.views = (resource.views || 0) + 1;
        await resource.save();

        // Return updated resource with populated fields
        const updated = await Resource.findById(req.params.id)
            .populate('uploader', 'name avatar college department')
            .populate('comments.user', 'name avatar');

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload resource
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        const { title, description, category, subject, type, externalUrl, tags, department, semester } = req.body;
        if (!title || !description || !category || !subject || !type) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        let fileUrl = '';
        let storagePath = '';

        if (req.file) {
            try {
                // Upload file to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'crss-resources',
                            resource_type: 'auto',
                            type: 'upload',
                            public_id: `${Date.now()}-${req.file.originalname.replace(/\s/g, '_').replace(/\.[^/.]+$/, '')}`,
                            use_filename: true,
                            unique_filename: false
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });

                fileUrl = result.secure_url;
                storagePath = result.public_id;
                cloudinaryId = result.public_id;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload file to cloud storage' });
            }
        }

        const resource = await Resource.create({
            title,
            description,
            category,
            subject,
            type,
            externalUrl: externalUrl || '',
            fileUrl,
            storagePath,
            tags: tags ? JSON.parse(tags) : [],
            uploader: req.user._id,
            college: req.user.college,
            department: department || req.user.department,
            semester: semester || '',
            likes: [],
            dislikes: [],
            downloads: 0,
            views: 0,
            comments: [],
            isVerified: false,
            isFeatured: false
        });

        const user = await User.findById(req.user._id);
        const nextUploadCount = (user.uploadCount || 0) + 1;
        const badge = nextUploadCount >= 10 ? 'Contributor' : 'Newbie';
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { uploadCount: 1, reputation: 10 },
            $addToSet: { badges: badge }
        });

        const populated = await resource.populate('uploader', 'name avatar college');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like / Unlike
router.put('/:id/like', protect, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Not found' });

        const liked = resource.likes.includes(req.user._id);
        if (liked) {
            resource.likes.pull(req.user._id);
        } else {
            resource.likes.push(req.user._id);
            resource.dislikes.pull(req.user._id);
        }

        await resource.save();
        res.json({ likes: resource.likes.length, dislikes: resource.dislikes.length, liked: !liked });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Download file (proxy Cloudinary file through the server and increment counter)
router.get('/:id/download', protect, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });

        if (!resource.fileUrl) {
            return res.status(400).json({ message: 'No file available for download' });
        }

        resource.downloads = (resource.downloads || 0) + 1;
        await resource.save();

        const fileUrl = new URL(resource.fileUrl);
        const client = fileUrl.protocol === 'https:' ? https : http;

        client.get(fileUrl.toString(), (cloudRes) => {
            if (cloudRes.statusCode !== 200) {
                console.error('Cloudinary proxy error:', cloudRes.statusCode);
                return res.status(cloudRes.statusCode).send('Unable to download file');
            }

            res.setHeader('Content-Type', cloudRes.headers['content-type'] || 'application/octet-stream');
            const filename = fileUrl.pathname.split('/').pop() || 'download';
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            cloudRes.pipe(res);
        }).on('error', (err) => {
            console.error('Cloudinary request error:', err);
            res.status(500).json({ message: 'Failed to retrieve file from cloud storage' });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Increment download counter only (for tracking without file download)
router.put('/:id/download', protect, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Not found' });

        resource.downloads = (resource.downloads || 0) + 1;
        await resource.save();

        res.json({ downloads: resource.downloads });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add comment
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Not found' });

        resource.comments.push({ user: req.user._id, text });
        await resource.save();
        const updated = await resource.populate('comments.user', 'name avatar');
        res.json(updated.comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save / Unsave resource
router.put('/:id/save', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const saved = user.savedResources.includes(req.params.id);
        if (saved) {
            user.savedResources.pull(req.params.id);
        } else {
            user.savedResources.push(req.params.id);
        }
        await user.save();
        res.json({ saved: !saved });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete resource
router.delete('/:id', protect, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Not found' });
        if (resource.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete file from Cloudinary if it exists
        if (resource.storagePath) {
            try {
                await cloudinary.uploader.destroy(resource.storagePath);
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError);
                // Don't fail the entire operation if Cloudinary delete fails
            }
        }

        await resource.deleteOne();
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
