const db = require("../database/db");

const Bookmarks = {
    TripsByUser: (id) => {
        const sql = `SELECT trip_id
        FROM bookmarked
        WHERE user_id = $1`
        return db.query(sql,[id])
        .then(dbRes => dbRes)
    },
    checkBookmarkExists: (userId, tripId) => {
        const sql = `SELECT id
        FROM bookmarked
        WHERE user_id = $1
        AND trip_id = $2`
        return db.query(sql,[userId, tripId])
        .then(dbRes => {
            return dbRes
        })
    },
    createBookmark: (userId, tripId) => {
        const sql = `INSERT INTO bookmarked (user_id, trip_id)
        VALUES($1, $2)`
        return db.query(sql,[userId, tripId])
        .then(dbRes => dbRes)
    },
    getBookmark: (userId, tripId) => {
        const sql = `SELECT id
        FROM bookmarked
        WHERE user_id =$1
        AND trip_id = $2`
        return db.query(sql,[userId, tripId])
        .then(dbRes => dbRes)
    },
    deleteBookmark: (userId, tripId) => {
        const sql = `DELETE FROM bookmarked
        WHERE user_id = $1
        AND trip_id = $2`
        return db.query(sql,[userId, tripId])
        .then(dbRes => dbRes)
    }
}

module.exports = Bookmarks;