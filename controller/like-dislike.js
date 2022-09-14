const express = require('express');
const router = express.Router();
const Votes = require('../models/like-dislike');

router.get('/:userId/:tripId', (request, response) => {
    const userId = request.params.userId;
    const tripId = request.params.tripId;
    Votes.checkLiked(userId, tripId)
        .then(dbRes => {
            if (dbRes.rowCount === 1) {
                return response.json(dbRes.rows[0])
            }
            else {
                return response.json({ noRow: true })
            }
        })
        .catch(err => response.json(err))
});

router.get('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Votes.countVotes(tripId)
        .then(res => response.json(res))
        .catch(err => response.json(err))
});

router.post('/changeLikeStatus', (request, response) => {
    console.log('in controller change status');
    const { liked, userId, tripId } = request.body;
    Votes.changeLiked(userId, tripId, liked)
        .then(dbRes => {
            if (dbRes.command === 'UPDATE') {
                return response.json({ message: 'Updated like status!' })
            }
            else {
                return response.json({ message: 'Created like status!' })
            }
        })
        .catch(err => response.json(err))
});

module.exports = router;