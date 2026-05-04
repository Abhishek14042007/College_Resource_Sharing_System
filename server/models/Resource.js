const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    type: {
        type: String,
        enum: ['Notes', 'Assignment', 'Lab Report', 'Question Paper', 'Textbook', 'Presentation', 'Video', 'Other'],
        required: true
    },
    fileUrl: { type: String, default: '' },
    storagePath: { type: String, default: '' },
    externalUrl: { type: String, default: '' },
    tags: [{ type: String }],
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    college: { type: String, required: true },
    department: { type: String, default: '' },
    semester: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

resourceSchema.index({ title: 'text', description: 'text', tags: 'text', subject: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
