const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {

    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude from queries by default
    },

    roles: {
      type: [String],
      enum: ['user', 'admin', 'moderator'],
      default: ['user'],
    },

    // Verification & Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,

    // used for soft delete
    isActive: {
      type: Boolean,
      default: true,
    },

    // Login & Security
    lastLogin: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    loginAttemptWindow: {
      type: Date,
    },
    isAccountLocked: {
      type: Boolean,
      default: false,
    },
    lockedUntil: {
      type: Date,
    },

    passwordResetToken: String,
    verificationCode: String,
    verificationCodeExpires: Date,
    is2FAVerified: {
      type: Boolean,
      default: false,
    },
   token:
      {
        token: String,
        expiresIn: { type: Date, default: Date.now },
      },
  
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// // Password comparison
// userSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Email verification token
// userSchema.methods.generateEmailVerificationToken = function () {
//   const token = crypto.randomBytes(32).toString('hex');
//   this.emailVerificationToken = token;
//   return token;
// };

// // Password reset token
// userSchema.methods.generatePasswordResetToken = function () {
//   const token = crypto.randomBytes(32).toString('hex');
//   this.passwordResetToken = token;
//   return token;
// };

// // Record login time
// userSchema.methods.markLogin = function () {
//   this.lastLogin = new Date();
//   this.failedLoginAttempts = 0;
//   this.isAccountLocked = false;
//   this.lockedUntil = null;
// };

// // Handle failed login
// userSchema.methods.registerFailedLogin = function () {
//   const now = new Date();

//   if (!this.loginAttemptWindow || now - this.loginAttemptWindow > 15 * 60 * 1000) {
//     // Reset window if outside 15 minutes
//     this.loginAttemptWindow = now;
//     this.failedLoginAttempts = 1;
//   } else {
//     this.failedLoginAttempts += 1;
//   }

//   // Lock account after 5 failed attempts
//   if (this.failedLoginAttempts >= 5) {
//     this.isAccountLocked = true;
//     this.lockedUntil = new Date(now.getTime() + 30 * 60 * 1000); // Lock for 30 mins
//   }
// };

module.exports = mongoose.model('User', userSchema);
