const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.get('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.details(tripId)
        .then(dbRes => response.json(dbRes.rows))
});

router.get('/activities/:tripId', (request, response) => {
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

router.delete('/delete/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    modifyTrip.delete(tripId)
        .then(dbRes => response.json(`Trip deleted! ${tripId}`))
        .catch(err => response.json('Trip could not be deleted!'))
});

router.put('/edit/:tripId', (request, response) => {
    return response.json('Editing trip...');
});

module.exports = router;