const { check } = require('express-validator/check');

module.exports = [
    check('password')
        .escape()
        .not().isEmpty()
        .isString(),
    check('email')
        .escape()
        .trim()
        .isEmail()
];
