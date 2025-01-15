import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty', 'registrar', 'accounting', 'hr', 'parent'],
        default: 'student'
    },
    permissions: [{
        type: String
    }],
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: Date,
    lastLogin: Date,
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    profileComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    this.updatedAt = Date.now();
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to handle failed login attempts
userSchema.methods.handleFailedLogin = async function () {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
        this.isLocked = true;
        this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;