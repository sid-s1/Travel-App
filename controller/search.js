const express = require('express');
const router = express.Router();
const Search = require('../models/search.js');
const Trip = require('../models/trips.js');

router.post('/', (request, response) => {
    const user_id = request.session.user_id;
    const searchString = request.body.searchString;
    const searchLowerCase = searchString.toLowerCase();
    const searchType = request.body.searchType;
    results = {
        users: [],
        trips: [],
        activities: []
    };
    tripIds = [];
    if (user_id) {
        results.user_id = user_id;
        console.log('logged in')
    } else {
        console.log('not logged in')
    }

    if (searchType === 'user') {
        Search.searchUsers(searchLowerCase)
        .then(dbRes => {
            for (let i=0; i < dbRes.rowCount; i++) {
                results.users.push(dbRes.rows[i]);
            }
            return response.json(results);
        });
    } else if (searchType === 'city') {
        Search.searchCities(searchLowerCase)
        .then((dbRes) => {
            const tripIdArr = [];
            for (let i = 0; i < dbRes.rowCount; i++) {
                tripIdArr.push(dbRes.rows[i]['trip_id'])
            }
            Trip.detailsMultiple(tripIdArr)
            .then(dbRes => {
                for (let i = 0; i < dbRes.rowCount; i++) {
                    results.trips.push(dbRes.rows[i])
                }
                return response.json(results);
            })
        });
    } else if (searchType === 'country') {
        Search.searchCountries(searchLowerCase)
        .then((dbRes) => {
            const tripIdArr = [];
            for (let i = 0; i < dbRes.rowCount; i++) {
                tripIdArr.push(dbRes.rows[i]['trip_id'])
            }
            Trip.detailsMultiple(tripIdArr)
            .then(dbRes => {
                for (let i = 0; i < dbRes.rowCount; i++) {
                    results.trips.push(dbRes.rows[i])
                }
                return response.json(results);
            })
        });
    } else if (searchType === 'activity') {
        Search.searchActivities(searchLowerCase)
        .then(dbRes => {
            for (let i=0; i < dbRes.rowCount; i++) {
                results.activities.push(dbRes.rows[i]);
            }
            return response.json(results);
        });
    } else if (searchType === 'all') {
        let p1 = new Promise((resolve, reject) => {
            Search.searchCities(searchLowerCase)
            .then(dbRes => {
                for (let i=0; i < dbRes.rowCount; i++) {
                    tripIds.push(dbRes.rows[i].trip_id);
                }
                resolve();
            });
        });
        let p2 = new Promise((resolve, reject) => {
            Search.searchCountries(searchLowerCase)
            .then(dbRes => {
                for (let i=0; i < dbRes.rowCount; i++) {
                    tripIds.push(dbRes.rows[i].trip_id);
                }
                resolve();
            })
        });
        let p3 = new Promise((resolve, reject) => {
            Search.searchUsers(searchLowerCase)
            .then(dbRes => {
                for (let i=0; i < dbRes.rowCount; i++) {
                    results.users.push(dbRes.rows[i]);
                }
                resolve();
            })
        });
        let p4 = new Promise((resolve, reject) => {
            Search.searchActivities(searchLowerCase)
            .then(dbRes => {
                for (let i=0; i < dbRes.rowCount; i++) {
                    results.activities.push(dbRes.rows[i]);
                }
                resolve();
            })
        });
        Promise.all([p1, p2, p3, p4]).then(() => {
            Trip.detailsMultiple(tripIds)
            .then(dbRes => {
                if (dbRes.rowCount > 0) {
                    for (let i=0; i < dbRes.rowCount; i++) {
                        results.trips.push(dbRes.rows[i]);
                    }
                }
                console.log(tripIds);
                return response.json(results);
            })
        })
        .catch(error => console.log(error));
    }
});

module.exports = router;