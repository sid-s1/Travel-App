const db = require('../database/db');

const User = {
    tripNumber: (id) => {
        const sql = 'SELECT DISTINCT users.id,users.username,(SELECT COUNT(*) AS trip_count FROM trips WHERE trips.user_id = users.id) FROM USERS INNER JOIN trips ON trips.user_id = users.id WHERE users.id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    countryNumber: (id) => {
        const sql = 'SELECT COUNT(*) AS country_count FROM (SELECT DISTINCT country_id FROM cities WHERE id in (SELECT city_id FROM trip_locations WHERE trip_id IN (SELECT id FROM trips WHERE user_id = $1))) AS country_ids';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    achievementNumber: (id) => {
        const sql = 'SELECT COUNT(*) AS achievement_count FROM user_achievements WHERE user_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    }
};

module.exports = User;