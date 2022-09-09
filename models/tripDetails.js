const db = require('../database/db');

const Trip = {
    details: (id) => {
        const sql = 'SELECT * FROM trips WHERE id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    cityId: (id) => {
        const sql = 'SELECT city_id FROM trip_locations WHERE trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => {
                if (dbRes.rowCount === 1) {
                    return { city_id: dbRes.rows[0].city_id }
                }
                else {
                    return dbRes.rows
                }
            })
            .catch(err => err)
    },
    cityName: (id) => {
        const sql = 'SELECT city_name FROM cities WHERE id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    },
    cityNames: (ids) => {
        let placeHolder = '';
        let iterator = 0;
        while (iterator !== ids.length) {
            iterator += 1;
            if ((iterator + 1) > ids.length) {
                placeHolder += `$${iterator}`;
            }
            else {
                placeHolder += `$${iterator},`;
            }
        }
        const sql = `SELECT city_name FROM cities WHERE id in (${placeHolder})`;
        return db.query(sql, [...ids])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    },
    locationIds: (id) => {
        const sql = 'SELECT id FROM trip_locations WHERE trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    },
    activities: (id) => {
        const sql = 'SELECT activities.activity_name, activities.gm_type, itinerary_items.activity_start_date, itinerary_items.activity_end_date, itinerary_items.activity_rating FROM activities INNER JOIN itinerary_items ON activities.id = itinerary_items.activity_id INNER JOIN trip_locations ON itinerary_items.trip_location_id = trip_locations.id WHERE trip_locations.trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    }
}

module.exports = Trip;

// const sql = 'SELECT city_name FROM cities WHERE id = $1';
// const cityId = dbRes.rows[0].city_id;
// return db.query(sql, [cityId])
//     .then(dbRes2 => dbRes2)
//     .catch(err => { err })
