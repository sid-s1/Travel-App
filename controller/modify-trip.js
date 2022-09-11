const express = require('express');
const router = express.Router();

router.delete('/deleteTrip/:tripId', (request, response) => {
    return response.json('Trip deleted!');
});

router.put('/editTrip/:tripId', (request, response) => {
    return response.json('Editing trip...');
});

module.exports = router;