import mysql2 = require('mysql2/promise')

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: 'Z',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
})

export {pool}