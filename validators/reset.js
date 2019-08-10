const { check } = require('express-validator/check');

module.exports = [
    check('password')
        .not().isEmpty()
        .isLength({ min: 5 })
];
