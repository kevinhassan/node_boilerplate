const { check } = require('express-validator/check');

module.exports = [
    check('oldPassword')
        .not().isEmpty()
        .isLength({ min: 5 }),
    check('newPassword')
        .not().isEmpty()
        .isLength({ min: 5 }),
];
