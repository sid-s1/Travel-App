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

router.get('/check/:tripId', (request, response) => {
    const userId = request.session.user_id;
    const tripId = request.params.tripId;
    console.log(`user: ${userId}, trip: ${tripId}`)
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        console.log(`match: ${dbRes.rowCount}`)
        return response.json(dbRes.rows)
    })
    .catch(err => console.log(err))
});

router.post('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    const userId = request.session.user_id;
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        if (dbRes.rowCount === 0) {
            Bookmarks.createBookmark(userId, tripId)
            .then(dbRes => {
                Bookmarks.getBookmark(userId, tripId)
                .then(dbRes => {
                    return response.json({BookmarkId: dbRes.rows[0].id})
                })
            })
            .catch(err => console.log(err))
        } else {
            return response.json({message: 'bookmark already created'})
        }
        console.log(dbRes);
    })
})

router.delete('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    const userId = request.session.user_id;
    console.log(`about to delete bookmark of trip ${tripId} for user ${userId}`)
    Bookmarks.checkBookmarkExists(userId, tripId)
    .then(dbRes => {
        if (dbRes.rowCount > 0) {
            Bookmarks.deleteBookmark(userId, tripId)
            .then(dbRes => {
                console.log(dbRes.rows);
                return response.json({message: 'bookmark successfully deleted'})
            })
            .catch(err => console.log(err));
        } else {
            return response.json({message: 'bookmark doesn\'t exist'})
        }
    })
})

module.exports = router;