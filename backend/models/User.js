import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

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
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty', 'registrar', 'accounting', 'hr', 'parent'],
        default: 'student',
        validate: {
            validator: function (value) {
                return this.constructor.schema.path('role').enumValues.includes(value);
            },
            message: props => `${props.value} is not a valid role!`
        }
    },
    permissions: [{
        type: String,
        validate: {
            validator: function (values) { // Correcting the validator for arrays
                const validPermissions = ['read', 'write', 'delete', 'manage'];
                return values.every(permission => validPermissions.includes(permission));
            },
            message: props => `One or more permissions are invalid!`
        }
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
        default: 'active',
        validate: {
            validator: function (value) {
                return this.constructor.schema.path('status').enumValues.includes(value);
            },
            message: props => `${props.value} is not a valid status!`
        }
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

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 12);
            next();
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    } else {
        next();
    }
});

// Update updatedAt field on save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to handle failed login attempts
userSchema.methods.handleFailedLogin = async function () {
    this.checkAndUnlock(); // Check and unlock if the lock period has expired

    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
        this.isLocked = true;
        this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await this.save();
};

// Method to check and unlock account
userSchema.methods.checkAndUnlock = function () {
    if (this.isLocked && this.lockUntil < Date.now()) {
        this.isLocked = false;
        this.lockUntil = null;
        this.failedLoginAttempts = 0;
    }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = Date.now();
    await this.save();
};

// Method to mark profile as complete
userSchema.methods.markProfileComplete = async function () {
    this.profileComplete = true;
    await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;