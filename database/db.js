const pg = require('pg');

const db = new pg.Pool({
    database: 'tript'
});

module.exports = db;