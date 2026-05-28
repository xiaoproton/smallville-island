const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./smallville.db');

module.exports = db;