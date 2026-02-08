const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
