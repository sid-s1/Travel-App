const db = require('../database/db');

const UserStats = {
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
    activityNumber: (id) => {
        const sql = `SELECT COUNT(*) AS activity_count FROM trips INNER JOIN trip_locations ON trips.id = trip_locations.trip_id INNER JOIN itinerary_items ON itinerary_items.trip_location_id = trip_locations.id RIGHT OUTER JOIN activities ON activities.id = itinerary_items.activity_id WHERE trips.user_id = $1 AND activities.gm_type='activity'`;
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    likesNumber: (id) => {
        const sql = 'SELECT COUNT(*) AS likes_count FROM trips INNER JOIN votes ON trips.id = votes.trip_id WHERE trips.user_id = $1 AND votes.liked = true';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    }
};

module.exports = UserStats;