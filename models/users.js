
const db = require("../database/db");

const User = {
  getIdUsernameAdmin: (email) => {
    const sql = 'SELECT id,username,admin FROM users WHERE email = $1';
    return db.query(sql, [email])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  checkExists: (email) => {
    const sql = 'SELECT * FROM users WHERE email=$1'
    return db.query(sql, [email])
      .then(dbRes => dbRes)
  },
  checkDoesNotExist: (email, username) => {
    const sql = 'SELECT * FROM users WHERE email=$1 or username=$2'
    return db.query(sql, [email, username])
      .then(dbRes => dbRes)
  },
  addNewUser: (username, email, password, securityQuestion, securityAnswer) => {
    const sql = `INSERT INTO users(username, email, password, security_qn, security_ans, admin) VALUES
    ($1, $2, $3, $4, $5, 'f')`
    return db.query(sql, [username, email, password, securityQuestion, securityAnswer])
      .then(dbRes => dbRes)
  },
  getAllUsers: () => {
    const sql = 'SELECT * FROM users';
    return db.query(sql)
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  updateUser: (id, email, username, password, secQns, secAns, admin) => {
    const sql = 'UPDATE users SET username=$1,email=$2,password=$3,security_qn=$4,security_ans=$5,admin=$6 WHERE id=$7';
    return db.query(sql, [username, email, password, secQns, secAns, admin, id])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  updateUserWithoutPassword: (id, email, username, secQns, secAns, admin) => {
    const sql = 'UPDATE users SET username=$1,email=$2,security_qn=$3,security_ans=$4,admin=$5 WHERE id=$6';
    return db.query(sql, [username, email, secQns, secAns, admin, id])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  updateUserWithoutSecAnswer: (id, email, username, password, secQns, admin) => {
    const sql = 'UPDATE users SET username=$1,email=$2,password=$3,security_qn=$4,admin=$5 WHERE id=$6';
    return db.query(sql, [username, email, password, secQns, admin, id])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  updateUserWithoutPasswordOrSecAnswer: (id, email, username, secQns, admin) => {
    const sql = 'UPDATE users SET username=$1,email=$2,security_qn=$3,admin=$4 WHERE id=$5';
    return db.query(sql, [username, email, secQns, admin, id])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  deleteUser: (id) => {
    const sql = 'DELETE FROM users WHERE id = $1';
    return db.query(sql, [id])
      .then(dbRes => dbRes)
      .catch(err => err)
  },
  checkAtleastOneAdmin: () => {
    const sql = 'SELECT COUNT(*) FROM users WHERE admin = true';
    return db.query(sql)
      .then(dbRes => dbRes)
      .catch(err => err)
  }
}

module.exports = User;
