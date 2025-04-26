const mysql = require('mysql2');

// create connection to db
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'db_leaderboard'
})

// connect to db
db.connect(err=>{
    if(err) throw console.log('Err in db connection');
    console.log('db connected');
})

module.exports = db;