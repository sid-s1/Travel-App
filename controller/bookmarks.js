const express = require('express');
const router = express.Router();
const Bookmarks = require('../models/bookmarks.js');
const Trip = require('../models/trips.js');

router.get('/all/:userId', (request, response) => {
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
        Trip.detailsMultiple(tripIds)
        .then(dbRes => {
            for (let i = 0; i < dbRes.rowCount; i++) {
                results.trips.push(dbRes.rows[i])
            }
            return response.json(results);
        });
    })
});

router.get('/:tripId/:userId', (request, response) => {
    const userId = request.params.userId;
    const tripId = request.params.tripId;
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        return dbRes;
    })
});

router.post('/', (request, response) => {
    const tripId = request.body.tripId;
    const userId = request.body.userId;
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        if (dbRes.rowCount === 0) {
            Bookmarks.createBookmark(userId, tripId)
            .then(dbRes => {
                return response.json({message: 'bookmark created ok'})
            })
            .catch(err => console.log(err))
        } else {
            return response.json({message: 'bookmark already created'})
        }
        console.log(dbRes);
    })
})

router.delete('/', (request, response) => {
    const tripId = request.body.tripId;
    const userId = request.body.userId;
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        if (dbRes.rowCount > 0) {
            Bookmarks.deleteBookmark(userId, tripId)
            .then(dbRes => {
                return response.json({message: 'bookmark successfully deleted'})
            })
            .catch(err => console.log(err))
        } else {
            return response.json({message: 'bookmark doesn\'t exist'})
        }
        console.log(dbRes.rows);
    })
})

module.exports = router;