const express = require('express');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

const router = express.Router();
const SequelizeConnect = require('./sequelize');

// Define the Sequelize model
const AppUser = SequelizeConnect.define('appusers', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true, // This line adds createdAt and updatedAt columns
  });

// Create the table if it doesn't exist
AppUser.sync();

router.get('/testusers', (req, res) => {
  console.log('testusers is working');
  res.send('router is working!');
});

router.post('/createappusers', async (req, res) => {
    const { UserName, Email, Password } = req.body;

  try {
    // Generate a salt and hash the password
    const hashpassword = await bcrypt.hash(Password, 10);

    // Insert the user into the database using Sequelize
    const user = await AppUser.create({ username:UserName, email:Email, password: hashpassword });

    console.log('User created successfully', user);
    res.status(201).json({ message: 'User created successfully', result: user.username });
  } catch (err) {
    console.error('Failed to create user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  const { UserName, Password } = req.body;
  console.log('username',UserName)
 
  
  try {
    // Retrieve user from the database based on the provided username
    const user = await AppUser.findOne({ where: { UserName } });
console.log('user',user)

    if (!user) {
      // User not found
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(Password, user.password);

    if (passwordMatch) {
      // Passwords match, login successful
      res.status(200).json({ message: 'Login successful!', username: user.username });
    } else {
      // Passwords don't match
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error retrieving user from the database:', err);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

module.exports = router;
