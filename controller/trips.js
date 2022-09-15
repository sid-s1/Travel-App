const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.get('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.details(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});

router.get('/activities/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.activities(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});

router.put('/:userId', (request, response) => {
    const userId = request.params.userId;
    Trip.createTripId(userId)
        .then(dbRes => {
            response.json(dbRes)
        })
        .catch(err => console.log(err))
});

router.delete('/delete/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.delete(tripId)
        .then(dbRes => response.json(`Trip deleted! ${tripId}`))
        .catch(err => response.json('Trip could not be deleted!'))
});

router.put('/edit/:tripId', (request, response) => {
    console.log('backend data collected:');
    const tripData = {
        tripId: request.params.tripId,
        user_id: request.body.user_id,
        trip_name: request.body.trip_name,
        trip_status: request.body.trip_status,
        trip_start_date: request.body.trip_start_date,
        trip_end_date: request.body.trip_end_date,
        hero_image_url: request.body.hero_image_url,
        description: request.body.description,
        key_takeaway: request.body.key_takeaway
    }
    console.log(tripData);
    Trip.edit(tripData)
.then(dbRes => {
    console.log(dbRes);
    response.json('Trip edited')
})
    .catch(err => response.json('Trip could not be edited'))
});

module.exports = router;