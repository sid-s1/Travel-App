const db = require('../database/db');

const Trip = {
    details: (id) => {
        const sql = 'SELECT trips.trip_name,trips.trip_status,trips.trip_start_date,trips.trip_end_date,trips.hero_image_url,trips.description,trips.key_takeaway,cities.city_name FROM trips INNER JOIN trip_locations ON trips.id = trip_locations.trip_id INNER JOIN cities ON trip_locations.city_id = cities.id WHERE trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    },
    detailsMultiple: (ids) => {
        const sql = `SELECT trips.id,trips.user_id,trips.trip_name,trips.trip_status,trips.trip_start_date,trips.trip_end_date,trips.hero_image_url,trips.description,trips.key_takeaway,cities.city_name,countries.country_name
        FROM trips
        INNER JOIN trip_locations ON trips.id = trip_locations.trip_id
        LEFT JOIN cities ON trip_locations.city_id = cities.id
        LEFT JOIN countries ON cities.country_id = countries.id
        WHERE trip_id = ANY ($1)`;
        return db.query(sql, [ids])
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
