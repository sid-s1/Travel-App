const db = require('../database/db');

const Trip = {
    details: (id) => {
        const sql = `SELECT trips.trip_name, trips.user_id, trips.trip_status, trips.trip_start_date, trips.trip_end_date, trips.hero_image_url, trips.description, trips.key_takeaway, cities.city_name
        FROM trips
        LEFT JOIN trip_locations ON trips.id = trip_locations.trip_id
        LEFT JOIN cities ON trip_locations.city_id = cities.id
        WHERE trips.id = $1`;
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    detailsMultiple: (ids) => {
        const sql = `SELECT trips.id,trips.user_id,trips.trip_name,trips.trip_status,trips.trip_start_date,trips.trip_end_date,trips.hero_image_url,trips.description,trips.key_takeaway,cities.city_name,countries.country_name
        FROM trips
        LEFT JOIN trip_locations ON trips.id = trip_locations.trip_id
        LEFT JOIN cities ON trip_locations.city_id = cities.id
        LEFT JOIN countries ON cities.country_id = countries.id
        WHERE trips.id = ANY ($1)`;
        return db.query(sql, [ids])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    tripOnlyDetails: (ids) => {
        const sql = `SELECT id, user_id, trip_name, trip_status, trip_start_date,trip_end_date, hero_image_url, description, key_takeaway
        FROM trips
        WHERE id = ANY ($1)`;
        return db.query(sql, [ids])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    tripCityAndCountry: (ids) => {
        const sql = `SELECT trips.id trip_id,cities.city_name,countries.country_name
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
        const sql = `SELECT activities.activity_name, activities.gm_type, itinerary_items.activity_start_date, itinerary_items.activity_end_date, itinerary_items.activity_rating, itinerary_items.id
        FROM activities
        INNER JOIN itinerary_items ON activities.id = itinerary_items.activity_id
        INNER JOIN trip_locations ON itinerary_items.trip_location_id = trip_locations.id
        WHERE trip_locations.trip_id = $1`;
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    updateActivity: (activityId, startDate, endDate, rating) => {
        const sql = `UPDATE itinerary_items
        SET activity_start_date = $1, activity_end_date = $2, activity_rating = $3
        WHERE activity_id = $4`
        return db.query(sql, [startDate, endDate, rating, activityId])
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
    postTrip: (tripId, minDate, maxDate) => { 
        const sql = `UPDATE trips SET trip_status='posted', trip_start_date=$1, trip_end_date=$2 WHERE id=$3`;
        return db.query(sql, [minDate, maxDate, tripId])
        .then(res => res)
        .catch(err => err)
    },
    getMinDate: (tripId) => {
        const sql = `SELECT MAX (activity_start_date) FROM itinerary_items WHERE trip_location_id= ANY (SELECT id FROM trip_locations WHERE trip_id=$1)`;
        return db.query(sql, [tripId])
        .then(res => res)
        .catch(err => err)
    },
    getMaxDate: (tripId) => {
        const sql = `SELECT MIN (activity_end_date) FROM itinerary_items WHERE trip_location_id= ANY (SELECT id FROM trip_locations WHERE trip_id=$1)`;
        return db.query(sql, [tripId])
        .then(res => res)
        .catch(err => err)
    }
}

module.exports = Trip;
