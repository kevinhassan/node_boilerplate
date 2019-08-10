const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const logger = require('../util/logger');

const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false }
}, { timestamps: true });


/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save() {
    try {
        if (this.isModified('password')) {
            await bcrypt.genSalt(10, async (err, salt) => {
                if (err) throw err;
                bcrypt.hash(this.password, salt, null, (err, hash) => {
                    if (err) throw err;
                    this.password = hash;
                });
            });
        }
        return this;
    } catch (err) {
        logger.error(err);
        throw err;
    }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    const isMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, result) => {
            if (err) {
                reject(new Error(500, 'Internal server error'));
            }
            resolve(result);
        });
    });
    return isMatch;
};

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
