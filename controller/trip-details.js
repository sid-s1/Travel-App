const express = require('express');
const router = express.Router();
const Trip = require('../models/trip-details');

router.get('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.details(tripId)
        .then(dbRes => response.json(dbRes.rows))
});

router.get('/activites/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.activities(tripId)
        .then(dbRes => response.json(dbRes.rows))
});

router.put('/:userId', (request, response) => {
    const userId = request.params.userId;
    Trip.createTripId(userId)
        .then(dbRes => {
            response.json(dbRes)
        })
        .catch(err => console.log(err))
});

module.exports = router;