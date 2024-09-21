// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { createConversation, sendMessage, getMessages,getConversations } = require('../controllers/chatController');

// Middleware auth
const { loginCheck, isAdmin } = require("../middlewares/authMiddleware");



// Route to create a conversation
router.post('/conversations',loginCheck, createConversation);

// Route to send a message
router.post('/messages',loginCheck, sendMessage);

// Route to get messages for a conversation
router.get('/conversations/:conversationId/messages',loginCheck, getMessages);
router.get('/conversations',loginCheck, getConversations);

module.exports = router;
