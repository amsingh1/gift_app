const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Notification = sequelize.define('notifications', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('gift_reserved', 'gift_unreserved', 'list_shared', 'event_reminder', 'gift_added'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedGiftId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  relatedEventId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Notification;
