require('dotenv').config()

const {DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER} = process.env

module.exports = {
  "development": {
    "username": DB_USER,
    "password": DB_PASS,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "postgres",
    "port": parseInt(DB_PORT, 10)
  },
  "test": {
    "username": DB_USER,
    "password": DB_PASS,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "postgres",
    "port": parseInt(DB_PORT, 10)
  },
  "production": {
    "username": DB_USER,
    "password": DB_PASS,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": "postgres",
    "port": parseInt(DB_PORT, 10)
  },
}
