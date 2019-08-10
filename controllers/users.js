const { promisify } = require('util');
const crypto = require('crypto');

const MyError = require('../util/error');
const Auth = require('../auth');
const { resetPasswordMail, confirmResetPasswordMail, confirmAccountCreationMail } = require('../mails');

const randomBytesAsync = promisify(crypto.randomBytes);
const User = require('../models/User');

/**
 * Sign in using email and password.
 */
exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select('password _id');
        if (!user) {
            throw new MyError(403, 'Invalid credentials.');
        }
        // check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new MyError(403, 'Invalid credentials.');
        }
        // return token + id to the user
        return { token: Auth.generateToken(user), userId: user._id };
    } catch (err) {
        if (!err.status) {
            throw new MyError(500, 'Internal server error.');
        }
        throw err;
    }
};

/**
 * Create a new local account.
 */
exports.signUp = async (data) => {
    try {
        const isUserAlreadyExisting = await User.findOne({ email: data.email }).select('email');
        if (isUserAlreadyExisting) throw new MyError(409, 'An account already exists for this email.');
        const user = new User({
            password: data.password,
            email: data.email
        });
        const newUser = await user.save();

        await confirmAccountCreationMail(newUser.email);
        return newUser;
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};

/**
 * Create a random token, then the send user an email with a reset link.
 */
exports.forgot = async (email) => {
    try {
        let user = await User.findOne({ email });
        if (!user) throw new MyError(404, 'No user found');
        user.passwordResetToken = await randomBytesAsync(16).then(buf => buf.toString('hex'));
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user = await user.save();
        if (!user) throw new MyError(500, 'Internal server error');
        const token = user.passwordResetToken;
        await resetPasswordMail(email, token);
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};
/**
 * Reset password with the new one.
 */
exports.resetPassword = async (token, password) => {
    try {
        const user = await User.findOne({ passwordResetToken: token }).where('passwordResetExpires').gt(Date.now());
        if (!user) throw new MyError(403, 'This link is expired.');
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        await confirmResetPasswordMail(user.email);
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};
/**
 * Update password with old password confirmation.
 */
exports.updatePassword = async (oldPassword, newPassword, user) => {
    try {
        const userCheck = await User.findById(user._id).select('password');
        if (!userCheck) {
            throw new MyError(403, 'Invalid credentials.');
        }
        const isMatch = await userCheck.comparePassword(oldPassword);

        if (!isMatch) {
            throw new MyError(403, 'Invalid password.');
        }
        userCheck.password = newPassword;
        await userCheck.save();
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};

/**
 * User authenticated profile.
 */
exports.getProfile = async (userId) => {
    try {
        const userProfile = await User.findById(userId).select('-password');
        return userProfile;
    } catch (err) {
        throw new MyError(500, 'Internal server error');
    }
};

/**
 * Profile page.
 */
exports.getAccount = async (user) => {
    try {
        const userAccount = await User.findById(user._id).select('email');
        return userAccount;
    } catch (err) {
        throw new MyError(500, 'Internal server error');
    }
};

exports.getUser = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password -passwordResetExpires -passwordResetToken');
        if (!user) throw new MyError(404, 'User not found');
        return user;
    } catch (err) {
        if (err.status) throw err;
        else if (err.name === 'CastError') {
            throw new MyError(404, 'User not found');
        }
        throw new MyError(500, 'Internal server error');
    }
};

/**
 * Update account page (mail, password)
 */
exports.putAccount = async (user, data) => {
    const {
        email, password
    } = data;
    try {
        const userProfile = await User.findById(user._id);
        if (email && email !== '') {
            const userFound = await User.findOne({ email, _id: { $ne: user._id } });
            if (userFound) throw new MyError(409, 'Email already used');
            userProfile.email = email;
        }
        if (password && password !== '') {
            userProfile.password = password;
        }
        await userProfile.save();
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};

/**
 * remove account page
 */
exports.deleteAccount = async (user) => {
    try {
        const userToDelete = await User.findById({ _id: user._id });
        if (!userToDelete) {
            throw new MyError(402, 'Not existing user');
        }
        await User.deleteOne({ _id: user._id });
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};

exports.findMemberWithMail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new MyError(404, 'User not found');
        return user;
    } catch (err) {
        if (err.status) throw err;
        throw new MyError(500, 'Internal server error');
    }
};
