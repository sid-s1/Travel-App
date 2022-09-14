const express = require('express');
const router = express.Router();
const likeDislike = require('../models/like-dislike');

router.get('/:userId/:tripId', (request, response) => {
    const userId = request.params.userId;
    const tripId = request.params.tripId;
    likeDislike.checkLiked(userId, tripId)
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

module.exports = router;