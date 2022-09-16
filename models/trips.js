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
    edit: (tripId) => {
        // add edit DB query
    },
    createTripId: (userId) => {
        const sql = "INSERT INTO trips(user_id, trip_status) VALUES($1, 'draft') RETURNING id";
        return db.query(sql, [userId])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    write: (column, value, tripId) => {
        let sql;
        let arr;
        switch (column) {
            case 'trip_name': 
                sql = `UPDATE trips SET trip_name=$1 WHERE id=$2`;
                arr = [value, tripId];
                break;
            case 'description':
                sql = `UPDATE trips SET description=$1 WHERE id=$2`;
                arr = [value, tripId];
                break;
            case 'key_takeaway':
                sql = `UPDATE trips SET key_takeaway=$1 WHERE id=$2`;
                arr = [value, tripId];
                break;
            case 'hero_image_url':
                sql = 'UPDATE trips SET hero_image_url=$1 WHERE id=$2'
                arr = [value, tripId];
                break;
        }
        return db.query(sql, arr)
            .then(res => res)
            .catch(err => err)
    },
    writeCountry: (country) => {
        const sql = 'INSERT INTO countries (country_name) SELECT $1 WHERE NOT EXISTS (SELECT id FROM countries WHERE country_name = $1)';
        return db.query(sql, [country])
        .then(res => res)
        .catch(err => err)
    },
    getCountry: (country) => {
        const sql = 'SELECT id FROM countries WHERE country_name=$1';
        return db.query(sql, [country])
        .then(res => res)
        .catch(err => err)
    },
    writeCity: (countryId, gm_api_city_id, city) => {
        const sql = 'INSERT INTO cities (country_id, gm_api_city_id, city_name) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT id FROM cities WHERE gm_api_city_id = $2)';
        return db.query(sql, [countryId, gm_api_city_id, city])
        .then(res => res)
        .catch(err => err)
    },
    getCity: (city) => {
        const sql = 'SELECT id FROM cities WHERE city_name=$1';
        return db.query(sql, [city])
        .then(res => res)
        .catch(err => err)
    },
    writeLocation: (trip_id, city_id) => {
        const sql = 'INSERT INTO trip_locations (trip_id, city_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT id FROM trip_locations WHERE trip_id=$1 AND city_id = $2)';
        return db.query(sql, [trip_id, city_id])
        .then(res => res)
        .catch(err => err)
    },
    getLocation: (trip_id, city_id) => {
        const sql = 'SELECT id FROM trip_locations WHERE trip_id=$1 AND city_id=$2';
        return db.query(sql, [trip_id, city_id])
        .then(res => res)
        .catch(err => err)
    },
    deleteLocation: (itineraryId) => {
        const sql = 'DELETE FROM trip_locations WHERE (SELECT COUNT(*) FROM itinerary_items WHERE trip_location_id = (SELECT trip_location_id FROM itinerary_items WHERE id = $1)) = 1 AND id = (SELECT trip_location_id FROM itinerary_items WHERE id = $1)';        
        return db.query(sql, [itineraryId])
        .then(res => res)
        .catch(err => err)
    },
    writeActivity: (name, gm_api_city_id, type) => {
        const sql = 'INSERT INTO activities (activity_name, gm_api_place_id, gm_type) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT id FROM activities WHERE gm_api_place_id = $2)';
        return db.query(sql, [name, gm_api_city_id, type])
        .then(res => res)
        .catch(err => err)
    },
    getActivity: (gm_api_place_id) => {
        const sql = 'SELECT id FROM activities WHERE gm_api_place_id=$1';
        return db.query(sql, [gm_api_place_id])
        .then(res => res)
        .catch(err => err)
    },
    writeItinItem: (locationId, activityId, startDate, endDate, rating) => {
        const sql = 'INSERT INTO itinerary_items (trip_location_id, activity_id, activity_start_date, activity_end_date, activity_rating) SELECT $1, $2, $3, $4, $5 WHERE NOT EXISTS (SELECT id FROM itinerary_items WHERE trip_location_id = $1 AND activity_id = $2 AND activity_start_date = $3)';
        return db.query(sql, [locationId, activityId, startDate, endDate, rating])
        .then(res => res)
        .catch(err => err)
    },
    getItinItem: (locationId, activityId, startDate) => {
        const sql = 'SELECT id FROM itinerary_items WHERE trip_location_id = $1 AND activity_id = $2 AND activity_start_date = $3';
        return db.query(sql, [locationId, activityId, startDate])
        .then(res => res)
        .catch(err => err)
    },
    deleteItinItem: (itineraryId) => {
        const sql = 'DELETE FROM itinerary_items WHERE id = $1';        
        return db.query(sql, [itineraryId])
        .then(res => res)
        .catch(err => err)
    },
    writeAirline: (name, type) => {
        const sql = 'INSERT INTO activities (activity_name, gm_type) SELECT $1, $2 WHERE NOT EXISTS (SELECT id FROM activities WHERE activity_name = $1)';
        return db.query(sql, [name, type])
            .then(res => res)
            .catch(err => err)
    },
    getAirline: (name) => {
        const sql = 'SELECT id FROM activities WHERE activity_name=$1';
        return db.query(sql, [name])
        .then(res => res)
        .catch(err => err)
    },
    writeAirlineLocation: (tripId) => {
        const sql = 'INSERT INTO trip_locations (trip_id, airline) SELECT $1, true WHERE NOT EXISTS (SELECT id FROM trip_locations WHERE trip_id = $1 AND airline = true)';
        return db.query(sql, [tripId])
            .then(res => res)
            .catch(err => err)
    },
    getAirlineLocation: (tripId) => {
        const sql = 'SELECT id FROM trip_locations WHERE trip_id=$1 AND airline = true';
        return db.query(sql, [tripId])
            .then(res => res)
            .catch(err => err)
    },
    writeAirlineItinItem: (locationId, airlineId, startDate, rating) => {
        const sql = 'INSERT INTO itinerary_items (trip_location_id, activity_id, activity_start_date, activity_rating) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT id FROM itinerary_items WHERE trip_location_id = $1 AND activity_id = $2 AND activity_start_date = $3)';
        return db.query(sql, [locationId, airlineId, startDate, rating])
        .then(res => res)
        .catch(err => err)
    },
    getAirlineItinItem: (locationId, airlineId, startDate) => {
        const sql = 'SELECT id FROM itinerary_items WHERE trip_location_id = $1 AND activity_id = $2 AND activity_start_date = $3';
        return db.query(sql, [locationId, airlineId, startDate])
        .then(res => res)
        .catch(err => err)
    },
}

module.exports = Trip;



