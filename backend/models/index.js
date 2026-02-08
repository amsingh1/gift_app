const sequelize = require('../sequelize');
const User = require('./User');
const Event = require('./Event');
const Gift = require('./Gift');
const ShareLink = require('./ShareLink');
const SharedAccess = require('./SharedAccess');
const Notification = require('./Notification');

// User -> Events (one-to-many)
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User -> Gifts (one-to-many)
User.hasMany(Gift, { foreignKey: 'userId', as: 'gifts' });
Gift.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Event -> Gifts (one-to-many)
Event.hasMany(Gift, { foreignKey: 'eventId', as: 'gifts' });
Gift.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Gift -> Reserved By User
User.hasMany(Gift, { foreignKey: 'reservedByUserId', as: 'reservedGifts' });
Gift.belongsTo(User, { foreignKey: 'reservedByUserId', as: 'reservedBy' });

// Event -> ShareLinks (one-to-many)
Event.hasMany(ShareLink, { foreignKey: 'eventId', as: 'shareLinks' });
ShareLink.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// User -> ShareLinks (owner)
User.hasMany(ShareLink, { foreignKey: 'ownerId', as: 'shareLinks' });
ShareLink.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Event -> SharedAccess (many-to-many through SharedAccess)
Event.hasMany(SharedAccess, { foreignKey: 'eventId', as: 'sharedWith' });
SharedAccess.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
User.hasMany(SharedAccess, { foreignKey: 'userId', as: 'accessibleEvents' });
SharedAccess.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Notifications (one-to-many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Notification -> fromUser
User.hasMany(Notification, { foreignKey: 'fromUserId', as: 'sentNotifications' });
Notification.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced successfully');
};

module.exports = {
  sequelize,
  User,
  Event,
  Gift,
  ShareLink,
  SharedAccess,
  Notification,
  syncDatabase,
};
