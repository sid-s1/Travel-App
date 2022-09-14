const express = require('express');
const router = express.Router();
const Bookmarks = require('../models/bookmarks.js');
const Trip = require('../models/trips.js');

router.get('/:userId', (request, response) => {
    const userId = request.params.userId;
    const authorisedUserId = request.session.user_id;
    const results = {
        users: [],
        trips: [],
        activities: []
    };
    if (authorisedUserId) {
        results.user_id = authorisedUserId;
        console.log('logged in');
    } else {
        console.log('not logged in');
    };
    Bookmarks.TripsByUser(userId)
    .then(dbRes => {
        const tripIds = []
        for (let i=0; i < dbRes.rowCount; i++) {
            tripIds.push(dbRes.rows[i]['trip_id']);
        }
        console.log(tripIds);
        Trip.detailsMultiple(tripIds)
        .then(dbRes => {
            for (let i = 0; i < dbRes.rowCount; i++) {
                results.trips.push(dbRes.rows[i])
            }
            return response.json(results);
        });
    })
});


module.exports = router;