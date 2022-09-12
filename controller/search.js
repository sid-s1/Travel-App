const express = require('express');
const router = express.Router();
const Search = require('../models/search.js');
const Trip = require('../models/trips.js');

router.post('/', (request, response) => {
    const searchString = request.body.searchString;
    const searchLowerCase = searchString.toLowerCase();
    const searchType = request.body.searchType;
    console.log(`${searchString} & ${searchType}`)
    if (searchType === 'user') {
        Search.searchUsers(searchLowerCase)
        .then(dbRes => response.json(dbRes.rows));
    } else if (searchType === 'city') {
        Search.searchCities(searchLowerCase)
        .then((dbRes) => {
            const tripIdArr = [];
            for (let i = 0; i < dbRes.rowCount; i++) {
                tripIdArr.push(dbRes.rows[i]['trip_id'])
            }
            Trip.detailsMultiple(tripIdArr)
            .then(dbRes => {
                if (dbRes.rowCount > 0) {
                    return response.json(dbRes.rows);
                } else {
                    return response.json({message: 'No results returned'});
                }
            })
        });
    } else if (searchType === 'country') {
        Search.searchCountries(searchLowerCase)
        .then(dbRes => {
            const tripIdArr = [];
            for (let i = 0; i < dbRes.rowCount; i++) {
                tripIdArr.push(dbRes.rows[i]['trip_id'])
            }
            Trip.detailsMultiple(tripIdArr)
            .then(dbRes => {
                if (dbRes.rowCount > 0) {
                    return response.json(dbRes.rows);
                } else {
                    return response.json({message: 'No results returned'});
                }
            })
        });
    } else if (searchType === 'activity') {
        Search.searchActivities(searchLowerCase)
        .then(dbRes => response.json(dbRes.rows));
    } else if (searchType === 'all') {
        results = {
            users: [],
            trips: [],
            activites: []
        }
        tripIds = []
        let p1 = new Promise((resolve, reject) => {
            Search.searchCities(searchLowerCase)
            .then(dbRes => {
                for (let i=0; i < dbRes.rowCount; i++) {
                    tripIds.push(dbRes.rows[i].trip_id);
                }
                resolve();
            });
        })
        .then(() => {
            return p2 = new Promise((resolve, reject) => {
                Search.searchUsers(searchLowerCase)
                .then(dbRes => {
                    for (let i=0; i < dbRes.rowCount; i++) {
                        tripIds.push(dbRes.rows[i].trip_id);
                    }
                    resolve();
                })
            })
            .then(() => {
                return p3 = new Promise((resolve, reject) => {
                    Search.searchUsers(searchLowerCase)
                    .then(dbRes => {
                        for (let i=0; i < dbRes.rowCount; i++) {
                            results.users.push(dbRes.rows[i]);
                        }
                        resolve();
                    })
                })
                .then(() => {
                    return p4 = new Promise((resolve, reject) => {
                        Search.searchActivities(searchLowerCase)
                        .then(dbRes => {
                            for (let i=0; i < dbRes.rowCount; i++) {
                                results.activites.push(dbRes.rows[i]);
                            }
                            resolve();
                        })
                    })
                    .then(() => {
                        return p5 = new Promise((resolve, reject) => {
                            Trip.detailsMultiple(tripIds)
                            .then(dbRes => {
                                if (dbRes.rowCount > 0) {
                                    for (let i=0; i < dbRes.rowCount; i++) {
                                        results.trips.push(dbRes.rows[i]);
                                    }
                                    resolve();
                                }
                            })
                        })
                    })
                })
            })
        })
        p1.then(() => {
            return response.json(results);
        })
        .catch(error => console.log(error))
    }
});

module.exports = router;