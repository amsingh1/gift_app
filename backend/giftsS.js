const express = require('express');
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const SequelizeConnect = require('./sequelize');

// Define the Sequelize model for gifts
const Gift = SequelizeConnect.define('gifts', {
  giftName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  giftLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reserved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
    timestamps: true, // This line adds createdAt and updatedAt columns
  
});

// Create the table if it doesn't exist
Gift.sync();

router.post('/sendgift', async (req, res) => {
  const { giftName, giftLink, imageLink } = req.body;

  try {
    // Insert the gift into the database using Sequelize
    const gift = await Gift.create({ giftName, giftLink, imageLink });

    console.log('Gift inserted successfully', gift);
    res.status(201).json({ message: 'Gift inserted successfully' });
  } catch (err) {
    console.error('Failed to insert gift:', err);
    res.status(500).json({ error: 'Failed to insert gift' });
  }
});

router.get('/getgifts', async (req, res) => {
  try {
    // Retrieve all gifts from the database using Sequelize
    const gifts = await Gift.findAll();

    console.log('Gifts fetched successfully', gifts);
    res.status(200).json(gifts);
  } catch (err) {
    console.error('Failed to fetch gifts:', err);
    res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

router.delete('/deletegift/:id', async (req, res) => {
  const giftId = req.params.id;

  try {
    // Delete the gift from the database based on ID using Sequelize
    const result = await Gift.destroy({ where: { id: giftId } });

    if (result === 0) {
      // No gift found with the given ID
      res.status(404).json({ error: 'Gift not found' });
      return;
    }

    console.log('Gift deleted successfully', result);
    res.status(200).json({ message: 'Gift deleted successfully' });
  } catch (err) {
    console.error('Failed to delete gift:', err);
    res.status(500).json({ error: 'Failed to delete gift' });
  }
});

router.patch('/updategift/:id', async (req, res) => {
  const giftId = req.params.id;
  const newReservedValue = req.body.reserved; // Assuming the new value is sent in the request body

  try {
    // Update the reserved column for the specified gift using Sequelize
    const result = await Gift.update({ reserved: newReservedValue }, { where: { id: giftId } });

    if (result[0] === 0) {
      // No gift found with the given ID
      res.status(404).json({ error: 'Gift not found' });
      return;
    }

    console.log('Reserved column updated successfully', result);
    res.status(200).json({ message: 'Reserved column updated successfully' });
  } catch (err) {
    console.error('Failed to update reserved column:', err);
    res.status(500).json({ error: 'Failed to update reserved column' });
  }
});

module.exports = router;
