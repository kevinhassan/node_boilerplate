const { validationResult } = require('express-validator/check');
const userController = require('../controllers/users');
const Auth = require('../middlewares/auth');
const {
    registerValidator, loginValidator,
    forgotValidator, resetValidator, passwordValidator,
} = require('../validators');

/**
* @swagger
* definitions:
*   NewUser:
*       properties:
*           email:
*               type: string
*           password:
*               type: string
*
*   LoginForm:
*       properties:
*           email:
*               type: string
*           password:
*               type: string
*
*   AccountForm:
*       properties:
*           email:
*               type: string
*           password:
*               type: string
*
*   ForgotPasswordForm:
*       properties:
*           email:
*               type: string
*
*   ResetPasswordForm:
*       properties:
*           password:
*               type: string
*
* /register:
*   post:
*       tags:
*           - User
*       description: User object that needs to be added to the application
*       summary: Create the new user
*       produces:
*           - application/json
*       parameters:
*           - name: body
*             description: The user to add
*             in: body
*             required: true
*             schema:
*               $ref: '#/definitions/NewUser'
*       responses:
*           201:
*               description: User successfully created
*           409:
*               description: An account already exists for this email
*           422:
*               description: Invalid form data
*           500:
*               description: Internal server error
* /login:
*   post:
*       tags:
*           - User
*       description: User object that needs to be log to the application
*       summary: Connect the user
*       produces:
*           - application/json
*       parameters:
*           - name: body
*             description: The user to sign in
*             in: body
*             required: true
*             schema:
*               $ref: '#/definitions/LoginForm'
*       responses:
*           200:
*               description: User successfully connected
*           403:
*               description: Invalid credentials (email and/or password)
*           422:
*               description: Invalid form data
*           500:
*               description: Internal server error
*
* /account:
*   delete:
*       tags:
*           - User
*       description: User account to delete
*       summary: Delete the user account
*       produces:
*           - application/json
*       responses:
*           204:
*               description: User successfuly deleted
*           401:
*               description: Unauthorized user
*           500:
*               description: Internal server error
*
* /account/password:
*    put:
*       tags:
*           - User
*       description: User object that needs to update his password
*       summary: Update the user password
*       produces:
*           - application/json
*       parameters:
*           - name: body
*             description: The user password to update
*             in: body
*             required: true
*             schema:
*               $ref: '#/definitions/AccountForm'
*       responses:
*           204:
*               description: User password updated
*           401:
*               description: Unauthorized user
*           409:
*               description: Email already used
*           422:
*               description: Invalid form data
*           500:
*               description: Internal server error
*
* /account/password/:token :
*    put:
*       tags:
*           - User
*       description: User object that needs to change his password because he forget it
*       summary: Update the user password
*       produces:
*           - application/json
*       parameters:
*           - name: body
*             description: The user password to update
*             in: body
*             required: true
*             schema:
*               $ref: '#/definitions/AccountForm'
*       responses:
*           204:
*               description: User password changed
*           401:
*               description: Expired token
*           409:
*               description: Email already used
*           422:
*               description: Invalid form data
*           500:
*               description: Internal server error
* /forgot:
*   post:
*       tags:
*           - User
*       description: User forgot his password
*       summary: Send email to the user to reset his password during 1 hours
*       produces:
*           - application/json
*       parameters:
*           - name: body
*             description: The email of the user which forgot the password
*             in: body
*             required: true
*             schema:
*               $ref: '#/definitions/ForgotPasswordForm'
*       responses:
*           200:
*               description: Reset mail sent
*           404:
*               description: No user found
*           422:
*               description: Invalid form data
*           500:
*               description: Internal server error
*
*/

module.exports = (router) => {
    router
        .post('/register', registerValidator, async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: 'Invalid form data' });
            }
            try {
                const user = await userController.signUp(req.body);
                res.status(201).send({ message: 'User successfully created.', user });
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        })
        .post('/login', loginValidator, async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: 'Invalid form data' });
            }
            try {
                const userInfo = await userController.login(req.body.email, req.body.password);
                res.status(200).send({ message: 'Connected.', token: userInfo.token, userId: userInfo.userId });
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        })
        .delete('/account', Auth.isAuthenticated, async (req, res) => {
            try {
                await userController.deleteAccount(req.user);
                res.sendStatus(204);
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        })
        .put('/account/password', Auth.isAuthenticated, [passwordValidator], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: 'Invalid form data' });
            }
            try {
                await userController.updatePassword(req.body.oldPassword, req.body.newPassword, req.user);
                res.sendStatus(204);
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        })
        .put('/account/password/:token', [resetValidator], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: 'Invalid form data' });
            }
            try {
                await userController.resetPassword(req.params.token, req.body.password);
                res.sendStatus(204);
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        })
        .post('/forgot', [forgotValidator], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ error: 'Invalid form data' });
            }
            try {
                await userController.forgot(req.body.email);
                res.status(200).json({ message: 'Reset mail sent.' });
            } catch (e) {
                res.status(e.status).send({ error: e.message });
            }
        });
};
