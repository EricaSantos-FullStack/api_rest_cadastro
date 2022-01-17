const mysql2 = require('mysql2');

var pool = mysql2.createPool({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_MYSQL_HOST,
    "port": process.env.MYSQL_MYSQL_PORT
});

exports.pool = pool;