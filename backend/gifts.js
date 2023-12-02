const express = require('express');
const router = express.Router()
const mysqlconnect = require ('./mysqlConnection')



router.post('/sendgift', (req, res) => {
    const { giftName, giftLink, imageLink } = req.body;
  
    // Insert the gift into the database
    const sql = 'INSERT INTO gifts (giftName, giftLink, imageLink) VALUES (?, ?, ?)';
    mysqlconnect.query(sql, [giftName, giftLink, imageLink], (err, result) => {
      if (err) {
        console.error('Failed to insert gift:', err);
        res.status(500).json({ error: 'Failed to insert gift' });
        return;
      }
  
      console.log('Gift inserted successfully', result);
      res.status(201).json({ message: 'Gift inserted successfully' });
    });
  });

  router.get('/getgifts', (req, res) => {
    // Retrieve the gift data from the database
    const sql = 'SELECT * FROM gifts';
    mysqlconnect.query(sql, (err, results) => {
      if (err) {
        console.error('Failed to fetch gifts:', err);
        res.status(500).json({ error: 'Failed to fetch gifts' });
        return;
      }
  
      console.log('Gifts fetched successfully', results);
      res.status(200).json(results);
    });
  });
  
  

  router.delete('/deletegift/:id', (req, res) => {
    const giftId = req.params.id;

    // Delete the gift from the database based on ID
    const sql = 'DELETE FROM gifts WHERE id = ?';
    mysqlconnect.query(sql, [giftId], (err, result) => {
        if (err) {
            console.error('Failed to delete gift:', err);
            res.status(500).json({ error: 'Failed to delete gift' });
            return;
        }

        console.log('Gift deleted successfully', result);
        res.status(200).json({ message: 'Gift deleted successfully' });
    });
});

router.patch('/updategift/:id', (req, res) => {
  const giftId = req.params.id;
  const newReservedValue = req.body.reserved; // Assuming the new value is sent in the request body

  // Update the reserved column for the specified gift
  const updateSql = 'UPDATE gifts SET reserved = ? WHERE id = ?';
  mysqlconnect.query(updateSql, [newReservedValue, giftId], (err, result) => {
      if (err) {
          console.error('Failed to update reserved column:', err);
          res.status(500).json({ error: 'Failed to update reserved column' });
          return;
      }

      console.log('Reserved column updated successfully', result);
      res.status(200).json({ message: 'Reserved column updated successfully' });
  });
});







module.exports= router 