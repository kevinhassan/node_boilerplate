const { check } = require('express-validator/check');

module.exports = [
    check('email')
        .isEmail()
];
