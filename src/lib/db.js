import mysql from 'mysql12/promise'
import { connection } from 'next/server'

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    databases: process.env.MYSQL_DATABASES || 'db_versephone',
    waitingForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export default pool