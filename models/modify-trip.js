const db = require('../database/db');

const modifyTrip = {
    delete: (tripId) => {
        const sql = 'DELETE FROM trips WHERE id = $1';
        return db.query(sql, [tripId])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    edit: (tripId) => {
        // add edit DB query
    }
};

module.exports = modifyTrip;