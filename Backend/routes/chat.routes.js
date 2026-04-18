const express = require('express');
const chatRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const chatController = require('../controllers/chat.controller.js');

chatRouter.get('/threads',authMiddleware.authUser, chatController.getThreads);

chatRouter.get('/threads/:id', authMiddleware.authUser, chatController.getThreadMessages);

chatRouter.delete('/threads/:id', authMiddleware.authUser, chatController.deleteThread);

chatRouter.post('/chatMessage', authMiddleware.authUser, chatController.handleChatMessage);

module.exports = chatRouter;