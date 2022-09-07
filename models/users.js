
const db = require("../database/db");

const User = {
  checkExists: (email) => {
    const sql = 'SELECT * FROM users WHERE email=$1'
    return db.query(sql, [email])
    .then(dbRes => dbRes)
  }
}

module.exports = User;
