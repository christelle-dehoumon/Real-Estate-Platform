const express = require('express');
const { sendMessage, getConversation, getConversationsList, deleteMessage, getUnreadCount, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getConversationsList);
router.get('/unread-count', protect, getUnreadCount);
router.post('/mark-read', protect, markAsRead);
router.get('/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
