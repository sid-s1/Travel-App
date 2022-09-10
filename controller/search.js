const express = require('express');
const router = express.Router();
const Search = require('../models/search.js');

router.post('/', (request, response) => {
    const searchString = request.body.searchString;
    const searchType = request.body.searchType;
    console.log(`${searchString} & ${searchType}`)
    if (searchType === 'user') {
        console.log('users search');
        Search.searchUsers(searchString)
        .then(dbRes => response.json(dbRes.rows));
    } else if (searchType === 'city') {
        console.log('city search');
        Search.searchCities(searchString)
        .then(dbRes => response.json(dbRes.rows));
    } else if (searchType === 'country') {
        console.log('country search');
        Search.searchCountries(searchString)
        .then(dbRes => response.json(dbRes.rows));
    } else if (searchType === 'all') {
        console.log('all search');
        Search.searchAll(searchString)
        .then(dbRes => response.json(dbRes.rows));
    }
});

module.exports = router;