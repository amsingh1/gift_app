const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Gift = sequelize.define('gifts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  giftName: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  giftLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  imageLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  reserved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reservedByUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reservedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Gift;
