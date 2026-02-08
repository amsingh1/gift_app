const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const giftRoutes = require('./routes/gifts');
const sharingRoutes = require('./routes/sharing');
const notificationRoutes = require('./routes/notifications');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sync database and start server
syncDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    process.exit(1);
  });
