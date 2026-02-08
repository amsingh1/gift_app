const express = require('express');
const router = express.Router();
const { Event, Gift, User, SharedAccess } = require('../models');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/events - get all events for the current user
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Gift,
          as: 'gifts',
          attributes: ['id'],
        },
      ],
      order: [['isDefault', 'DESC'], ['eventDate', 'ASC'], ['createdAt', 'DESC']],
    });

    const eventsWithCount = events.map(event => ({
      ...event.toJSON(),
      giftCount: event.gifts.length,
      gifts: undefined,
    }));

    res.json({ events: eventsWithCount });
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - create a new event
router.post('/', async (req, res) => {
  const { name, description, eventDate } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  try {
    const event = await Event.create({
      userId: req.userId,
      name,
      description,
      eventDate: eventDate || null,
      isDefault: false,
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /api/events/:id - get a specific event with its gifts
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Gift,
          as: 'gifts',
          include: [
            { model: User, as: 'reservedBy', attributes: ['id', 'username', 'displayName'] },
          ],
        },
        { model: User, as: 'owner', attributes: ['id', 'username', 'displayName'] },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check access: owner or shared access
    const isOwner = event.userId === req.userId;
    const hasAccess = await SharedAccess.findOne({
      where: { eventId: event.id, userId: req.userId },
    });

    if (!isOwner && !hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If the viewer is the owner, hide reservation details (surprise!)
    const eventData = event.toJSON();
    if (isOwner) {
      eventData.gifts = eventData.gifts.map(gift => ({
        ...gift,
        reservedByUserId: undefined,
        reservedBy: undefined,
        reservedAt: undefined,
      }));
    }

    eventData.isOwner = isOwner;

    res.json({ event: eventData });
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// PUT /api/events/:id - update an event
router.put('/:id', async (req, res) => {
  const { name, description, eventDate } = req.body;

  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update({ name, description, eventDate });

    res.json({ message: 'Event updated', event });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.isDefault) {
      return res.status(400).json({ error: 'Cannot delete the default wishlist' });
    }

    // Delete associated gifts, share links, and shared access
    await Gift.destroy({ where: { eventId: event.id } });
    await SharedAccess.destroy({ where: { eventId: event.id } });

    await event.destroy();

    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
