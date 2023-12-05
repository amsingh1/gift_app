const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
//const mysqlconnect = require('./mysqlConnection')
//const appUsers = require('./appUsers')
const appUsersS = require('./appUsersS')
//const gifts = require('./gifts')
const giftsS = require('./giftsS')
const bodyParser = require('body-parser');
const sequelize = require('./sequelize')

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
// appUsers routes
//app.use('/', appUsers)
app.use('/', appUsersS)
//app.use('/gifts', gifts)
app.use('/gifts', giftsS)
// Define your API routes here
app.get('/name', (req, res)=>{
res.json({users: "these are our users!"})
})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
