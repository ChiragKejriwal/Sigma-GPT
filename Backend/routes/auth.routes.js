const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware.js');
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authRouter.post('/login', authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */

authRouter.get('/logout', authController.logoutUser);

/**
 * @route GET /api/auth/get-me
 * @desc Get current user info
 * @access Private
 */

authRouter.get('/get-me', authMiddleware.authUser, authController.getMe);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
authRouter.put('/profile', authMiddleware.authUser, authController.updateProfile);

/**
 * @route DELETE /api/auth/profile
 * @desc Delete user account
 * @access Private
 */

authRouter.delete('/profile', authMiddleware.authUser, authController.deleteAccount);



module.exports = authRouter;