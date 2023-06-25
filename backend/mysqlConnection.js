
// MySQL connection setup
const mysqlconn= require("mysql2")
const db = mysqlconn.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'giftApp',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports=db
