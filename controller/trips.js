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
        .then(dbRes => response.json(dbRes))
        .catch(err => console.log(err))
});

router.delete('/delete/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.delete(tripId)
        .then(dbRes => response.json(`Trip deleted! ${tripId}`))
        .catch(err => response.json('Trip could not be deleted!'))
});

router.put('/edit/:tripId', (request, response) => {
    return response.json('Editing trip...');
});

// ADD NEW TRIP
router.post('/', (request, response) => {
    // const data = request.body;
    const { userId, placeId, name, city, country } = request.body;
    console.log('>>>>> GET COUNTRY <<<<<')
    Trip.create(country)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});

// TRIP NAME
router.post('/name', (request, response) => {
    const { userInput, tripId } = request.body;
    Trip.writeName(userInput, tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
})
router.delete('/name/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.deleteName(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});
// TRIP DESCRIPTION
router.post('/description', (request, response) => {
    const { userInput, tripId } = request.body;
    Trip.writeDescription(userInput, tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
})
router.delete('/description/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.deleteDescription(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});







module.exports = router;