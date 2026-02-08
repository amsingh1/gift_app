const express = require('express');
const router = express.Router();
const { Gift, Event, User, Notification, SharedAccess } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// POST /api/gifts - create a new gift
router.post('/', async (req, res) => {
  const { eventId, giftName, giftLink, imageLink, description, price, priority } = req.body;

  if (!giftName) {
    return res.status(400).json({ error: 'Gift name is required' });
  }

  try {
    // If eventId provided, verify ownership
    if (eventId) {
      const event = await Event.findOne({
        where: { id: eventId, userId: req.userId },
      });
      if (!event) {
        return res.status(404).json({ error: 'Event not found or access denied' });
      }
    } else {
      // Find or create default event
      let defaultEvent = await Event.findOne({
        where: { userId: req.userId, isDefault: true },
      });
      if (!defaultEvent) {
        defaultEvent = await Event.create({
          userId: req.userId,
          name: 'My Wishlist',
          description: 'My default wishlist',
          isDefault: true,
        });
      }
      req.body.eventId = defaultEvent.id;
    }

    const gift = await Gift.create({
      userId: req.userId,
      eventId: req.body.eventId || eventId,
      giftName,
      giftLink,
      imageLink,
      description,
      price,
      priority: priority || 'medium',
    });

    // Notify users who have access to this event
    const sharedUsers = await SharedAccess.findAll({
      where: { eventId: gift.eventId },
    });

    const currentUser = await User.findByPk(req.userId);

    for (const access of sharedUsers) {
      await Notification.create({
        userId: access.userId,
        type: 'gift_added',
        message: `${currentUser.displayName || currentUser.username} added "${giftName}" to their wishlist`,
        relatedGiftId: gift.id,
        relatedEventId: gift.eventId,
        fromUserId: req.userId,
      });
    }

    res.status(201).json({ message: 'Gift created', gift });
  } catch (err) {
    console.error('Create gift error:', err);
    res.status(500).json({ error: 'Failed to create gift' });
  }
});

// GET /api/gifts/event/:eventId - get all gifts for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOwner = event.userId === req.userId;
    const hasAccess = await SharedAccess.findOne({
      where: { eventId: event.id, userId: req.userId },
    });

    if (!isOwner && !hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const gifts = await Gift.findAll({
      where: { eventId: req.params.eventId },
      include: [
        { model: User, as: 'reservedBy', attributes: ['id', 'username', 'displayName'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Hide reservation details from the gift owner
    const giftsData = gifts.map(gift => {
      const g = gift.toJSON();
      if (isOwner) {
        return {
          ...g,
          reserved: g.reserved,
          reservedByUserId: undefined,
          reservedBy: undefined,
          reservedAt: undefined,
        };
      }
      return g;
    });

    res.json({ gifts: giftsData, isOwner });
  } catch (err) {
    console.error('Get gifts error:', err);
    res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

// PUT /api/gifts/:id - update a gift
router.put('/:id', async (req, res) => {
  const { giftName, giftLink, imageLink, description, price, priority } = req.body;

  try {
    const gift = await Gift.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found or access denied' });
    }

    await gift.update({ giftName, giftLink, imageLink, description, price, priority });

    res.json({ message: 'Gift updated', gift });
  } catch (err) {
    console.error('Update gift error:', err);
    res.status(500).json({ error: 'Failed to update gift' });
  }
});

// DELETE /api/gifts/:id - delete a gift
router.delete('/:id', async (req, res) => {
  try {
    const gift = await Gift.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found or access denied' });
    }

    await gift.destroy();

    res.json({ message: 'Gift deleted' });
  } catch (err) {
    console.error('Delete gift error:', err);
    res.status(500).json({ error: 'Failed to delete gift' });
  }
});

// PATCH /api/gifts/:id/reserve - toggle reservation
router.patch('/:id/reserve', async (req, res) => {
  try {
    const gift = await Gift.findByPk(req.params.id, {
      include: [{ model: Event, as: 'event' }],
    });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // Cannot reserve your own gift
    if (gift.userId === req.userId) {
      return res.status(400).json({ error: 'You cannot reserve your own gift' });
    }

    // Check access
    const hasAccess = await SharedAccess.findOne({
      where: { eventId: gift.eventId, userId: req.userId },
    });

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Already reserved by someone else
    if (gift.reserved && gift.reservedByUserId !== req.userId) {
      return res.status(400).json({ error: 'This gift is already reserved by someone else' });
    }

    const isReserving = !gift.reserved;

    await gift.update({
      reserved: isReserving,
      reservedByUserId: isReserving ? req.userId : null,
      reservedAt: isReserving ? new Date() : null,
    });

    // Notify other users with access (not the gift owner, not the reserver)
    const currentUser = await User.findByPk(req.userId);
    const sharedUsers = await SharedAccess.findAll({
      where: { eventId: gift.eventId },
    });

    for (const access of sharedUsers) {
      if (access.userId !== req.userId && access.userId !== gift.userId) {
        await Notification.create({
          userId: access.userId,
          type: isReserving ? 'gift_reserved' : 'gift_unreserved',
          message: isReserving
            ? `${currentUser.displayName || currentUser.username} reserved "${gift.giftName}"`
            : `${currentUser.displayName || currentUser.username} unreserved "${gift.giftName}"`,
          relatedGiftId: gift.id,
          relatedEventId: gift.eventId,
          fromUserId: req.userId,
        });
      }
    }

    res.json({
      message: isReserving ? 'Gift reserved' : 'Gift unreserved',
      gift: {
        id: gift.id,
        reserved: gift.reserved,
        reservedByUserId: gift.reservedByUserId,
      },
    });
  } catch (err) {
    console.error('Reserve gift error:', err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

module.exports = router;
