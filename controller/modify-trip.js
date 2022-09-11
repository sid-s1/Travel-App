const express = require('express');
const router = express.Router();
const modifyTrip = require('../models/modify-trip');

router.delete('/deleteTrip/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    modifyTrip.delete(tripId)
        .then(dbRes => response.json(`Trip deleted! ${tripId}`))
        .catch(err => response.json('Trip could not be deleted!'))
});

router.put('/editTrip/:tripId', (request, response) => {
    return response.json('Editing trip...');
});

module.exports = router;