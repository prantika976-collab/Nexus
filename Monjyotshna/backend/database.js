const Database = require("better-sqlite3");

const db = new Database("monjo.db");

db.pragma("journal_mode = WAL");

console.log("Monjo database connected successfully");

module.exports = db;
