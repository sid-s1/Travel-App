const db = require("../database/db");

const Bookmarks = {
    TripsByUser: (id) => {
        const sql = `SELECT trip_id
        FROM bookmarked
        WHERE user_id = $1`
        return db.query(sql,[id])
        .then(dbRes => dbRes)
    }
}

module.exports = Bookmarks;