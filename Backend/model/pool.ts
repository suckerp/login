import mysql2 = require('mysql2/promise')
import { config } from '../server'

const pool = mysql2.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    timezone: 'Z',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
})

export {pool}