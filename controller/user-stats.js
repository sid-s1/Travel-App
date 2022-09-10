const express = require('express');
const router = express.Router();
const User = require('../models/user-stats');

router.get('/tripNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    User.tripNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

router.get('/countryNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    User.countryNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

router.get('/achievementNumber/:userId', (request, response) => {
    const userId = request.params.userId;
    User.achievementNumber(userId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => console.log(err))
});

module.exports = router;