const express = require('express');
const router = express.Router();
const { Notification, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/notifications - get all notifications for the current user
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      include: [
        { model: User, as: 'fromUser', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { userId: req.userId, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read - mark a notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id, userId: req.userId } }
    );
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PATCH /api/notifications/read-all - mark all notifications as read
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.userId, isRead: false } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

module.exports = router;
