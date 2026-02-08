const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { Event, ShareLink, SharedAccess, User, Notification } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// POST /api/sharing/create-link - create a share link for an event
router.post('/create-link', async (req, res) => {
  const { eventId, expiresInDays } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const event = await Event.findOne({
      where: { id: eventId, userId: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    const token = uuidv4();
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const shareLink = await ShareLink.create({
      eventId,
      ownerId: req.userId,
      token,
      expiresAt,
    });

    res.status(201).json({
      message: 'Share link created',
      shareLink: {
        token: shareLink.token,
        expiresAt: shareLink.expiresAt,
      },
    });
  } catch (err) {
    console.error('Create share link error:', err);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

// POST /api/sharing/accept/:token - accept a share link
router.post('/accept/:token', async (req, res) => {
  try {
    const shareLink = await ShareLink.findOne({
      where: { token: req.params.token, isActive: true },
      include: [
        { model: Event, as: 'event', include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'displayName'] }] },
      ],
    });

    if (!shareLink) {
      return res.status(404).json({ error: 'Invalid or expired share link' });
    }

    // Check expiry
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return res.status(410).json({ error: 'This share link has expired' });
    }

    // Cannot accept your own share link
    if (shareLink.ownerId === req.userId) {
      return res.status(400).json({ error: 'You cannot use your own share link' });
    }

    // Check if already has access
    const existing = await SharedAccess.findOne({
      where: { eventId: shareLink.eventId, userId: req.userId },
    });

    if (existing) {
      return res.json({
        message: 'You already have access to this wishlist',
        event: shareLink.event,
      });
    }

    await SharedAccess.create({
      eventId: shareLink.eventId,
      userId: req.userId,
    });

    // Notify the owner
    const currentUser = await User.findByPk(req.userId);
    await Notification.create({
      userId: shareLink.ownerId,
      type: 'list_shared',
      message: `${currentUser.displayName || currentUser.username} joined your "${shareLink.event.name}" wishlist`,
      relatedEventId: shareLink.eventId,
      fromUserId: req.userId,
    });

    res.json({
      message: 'Access granted',
      event: shareLink.event,
    });
  } catch (err) {
    console.error('Accept share link error:', err);
    res.status(500).json({ error: 'Failed to accept share link' });
  }
});

// GET /api/sharing/shared-with-me - get events shared with the current user
router.get('/shared-with-me', async (req, res) => {
  try {
    const sharedAccess = await SharedAccess.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            { model: User, as: 'owner', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
            { model: Gift, as: 'gifts', attributes: ['id'] },
          ],
        },
      ],
    });

    const events = sharedAccess.map(sa => ({
      ...sa.event.toJSON(),
      giftCount: sa.event.gifts.length,
      gifts: undefined,
    }));

    res.json({ events });
  } catch (err) {
    console.error('Get shared events error:', err);
    res.status(500).json({ error: 'Failed to fetch shared events' });
  }
});

// GET /api/sharing/event/:eventId/members - get members with access to an event
router.get('/event/:eventId/members', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.eventId, userId: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    const members = await SharedAccess.findAll({
      where: { eventId: req.params.eventId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'displayName', 'avatarUrl'] },
      ],
    });

    res.json({ members: members.map(m => m.user) });
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// DELETE /api/sharing/event/:eventId/member/:userId - remove access
router.delete('/event/:eventId/member/:userId', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.eventId, userId: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    await SharedAccess.destroy({
      where: { eventId: req.params.eventId, userId: req.params.userId },
    });

    res.json({ message: 'Access removed' });
  } catch (err) {
    console.error('Remove access error:', err);
    res.status(500).json({ error: 'Failed to remove access' });
  }
});

module.exports = router;
