const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SharedAccess = sequelize.define('shared_access', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = SharedAccess;
