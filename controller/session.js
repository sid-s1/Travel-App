require("dotenv").config();

// Express library to handle sessions
const expressSession = require("express-session"); 

// Store session in DB
const pgSession = require("connect-pg-simple")(expressSession);

module.exports = { expressSession, pgSession } 