const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const mysqlconnect = require('./mysqlConnection')
const appUsers = require('./appUsers')
const gifts = require('./gifts')
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
// appUsers routes
app.use('/', appUsers)
app.use('/gifts', gifts)
// Define your API routes here
app.get('/name', (req, res)=>{
res.json({users: "these are our users!"})
})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
