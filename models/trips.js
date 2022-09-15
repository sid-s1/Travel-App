const db = require('../database/db');

const Trip = {
    details: (id) => {
        const sql = 'SELECT trips.trip_name,trips.user_id,trips.trip_status,trips.trip_start_date,trips.trip_end_date,trips.hero_image_url,trips.description,trips.key_takeaway,cities.city_name FROM trips INNER JOIN trip_locations ON trips.id = trip_locations.trip_id INNER JOIN cities ON trip_locations.city_id = cities.id WHERE trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
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
            .catch(err => err)
    },
    tripIdsByUserId: (id) => {
        const sql = `SELECT trips.id
        FROM users
        LEFT JOIN trips ON users.id = trips.user_id
        WHERE users.id = $1`;
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    activities: (id) => {
        const sql = 'SELECT activities.activity_name, activities.gm_type, itinerary_items.activity_start_date, itinerary_items.activity_end_date, itinerary_items.activity_rating FROM activities INNER JOIN itinerary_items ON activities.id = itinerary_items.activity_id INNER JOIN trip_locations ON itinerary_items.trip_location_id = trip_locations.id WHERE trip_locations.trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    delete: (tripId) => {
        const sql = 'DELETE FROM trips WHERE id = $1';
        return db.query(sql, [tripId])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    edit: (tripData) => {
        console.log('edit function underway');
        const sql = `UPDATE trips
        SET trip_name = $3, trip_status = $4, trip_start_date = $5, trip_end_date = $6, hero_image_url = $7, description = $8, key_takeaway = $9
        WHERE id = $1
        AND user_id = $2`
        return db.query(sql, [tripData.tripId, tripData.user_id, tripData.trip_name, tripData.trip_status, tripData.trip_start_date, tripData.trip_end_date, tripData.hero_image_url, tripData.description, tripData.key_takeaway])
        .then(dbRes => dbRes)
        .catch(err => err);
    }
}

module.exports = Trip;
