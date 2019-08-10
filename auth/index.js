const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
};
