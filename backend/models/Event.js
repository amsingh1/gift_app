const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Event = sequelize.define('events', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Event;
