const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    college: { type: String, required: true },
    department: { type: String, default: '' },
    year: { type: String, enum: ['1st', '2nd', '3rd', '4th', 'Graduate', 'Faculty'], default: '1st' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    savedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    badges: [{ type: String }],
    uploadCount: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
