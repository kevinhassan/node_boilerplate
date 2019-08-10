const forgotValidator = require('./forgot');
const loginValidator = require('./login');
const registerValidator = require('./register');
const resetValidator = require('./reset');
const passwordValidator = require('./password');

module.exports = {
    forgotValidator,
    loginValidator,
    registerValidator,
    resetValidator,
    passwordValidator,
};
