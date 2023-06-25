const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router()
const mysqlconnect = require ('./mysqlConnection')

router.get('/testusers',(req,res)=> {
    console.log('testusers is working')
    res.send('router is working!')
})

router.post('/createappusers',(req,res)=>{

    const { username, email, password } = req.body;
// Generate a salt and hash the password
    bcrypt.hash(password, 10, (err, hashpassword) => {
        if (err) {
          console.error('Error generating password hash:', err);
          res.status(500).json({ error: 'An internal server error occurred' });
          return;
        }

  // Insert the user into the database
  const sql = 'INSERT INTO appusers (username, email, password) VALUES (?, ?, ?)';
  mysqlconnect.query(sql, [username, email, hashpassword], (err, result) => {
    if (err) {
      console.error('Failed to create user:', err);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    console.log('User created successfully');
    res.status(201).json({ message: 'User created successfully' });
  });

})
})

module.exports= router 