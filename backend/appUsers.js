const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router()
const mysqlconnect = require ('./mysqlConnection')

router.get('/testusers',(req,res)=> {
    console.log('testusers is working')
    res.send('router is working!')
})

router.post('/createappusers',(req,res)=>{

    const { UserName, Email, Password } = req.body;
// Generate a salt and hash the password
    bcrypt.hash(Password, 10, (err, hashpassword) => {
        if (err) {
          console.error('Error generating password hash:', err);
          res.status(500).json({ error: 'An internal server error occurred' });
          return;
        }

  // Insert the user into the database
  const sql = 'INSERT INTO appusers (username, email, password) VALUES (?, ?, ?)';
  mysqlconnect.query(sql, [UserName, Email, hashpassword], (err, result) => {
    if (err) {
      console.error('Failed to create user:', err);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    console.log('User created successfully', result ); 
    res.status(201).json({ message: 'User created successfully', result: result.username });
  });

})
})

router.post('/login', (req, res) => {
  const { UserName, Password } = req.body;

  // Retrieve user from the database based on the provided username
  const sql = 'SELECT * FROM appusers WHERE username = ?';
  mysqlconnect.query(sql, [UserName], (err, results) => {
    if (err) {
      console.error('Error retrieving user from the database:', err);
      res.status(500).json({ error: 'An internal server error occurred' });
      return;
    }

    if (results.length === 0) {
      // User not found
      res.status(401).json({ error: 'no user found:Invalid username or password' });
      return;
    }

    const user = results[0];

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(Password, user.password, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }

      if (passwordMatch) {
        // Passwords match, login successful
        res.status(200).json({ message: 'Login successful', username: user.username });
      } else {
        // Passwords don't match
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
});


module.exports= router 