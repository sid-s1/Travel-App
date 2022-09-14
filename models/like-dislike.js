const db = require('../database/db');

const likeDislike = {
    checkLiked: (userId, tripId) => {
        const sql = 'SELECT liked FROM votes WHERE user_id = $1 AND trip_id = $2';
        return db.query(sql, [userId, tripId])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    changeLiked: (userId, tripId, newValue) => {
        const sql = 'UPDATE votes SET liked = $1 WHERE user_id = $2 AND trip_id = $3';
        return db.query(sql, [newValue, userId, tripId])
            .then(dbRes => {
                console.log(dbRes);
                return dbRes;
            })
            .catch(err => err)
    }
};

module.exports = likeDislike;