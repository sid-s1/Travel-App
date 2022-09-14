const db = require('../database/db');

const likeDislike = {
    checkLiked: (userId, tripId) => {
        const sql = 'SELECT liked FROM votes WHERE user_id = $1 AND trip_id = $2';
        return db.query(sql, [userId, tripId])
            .then(dbRes => dbRes)
            .catch(err => err)
    }
};

module.exports = likeDislike;