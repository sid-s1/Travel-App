const express = require('express');
const router = express.Router();
const UserStats = require('../models/user-stats');

router.get('/tripNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    UserStats.tripNumber(userId)
        .then(dbRes => {
            if (dbRes.rowCount === 0) return response.json(0);
            else return response.json(dbRes.rows)
        })
        .catch(err => console.log(err))
});

router.get('/countryNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    UserStats.countryNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

router.get('/activityNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    UserStats.activityNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

router.get('/likesNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    UserStats.likesNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

module.exports = router;