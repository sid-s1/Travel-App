const express = require('express');
const router = express.Router();
const Trip = require('../models/trips');

router.get('/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.details(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});

router.get('/activities/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.activities(tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
});

router.put('/:userId', (request, response) => {
    const userId = request.params.userId;
    Trip.createTripId(userId)
        .then(dbRes => response.json(dbRes))
        .catch(err => response.json(err))
});

router.delete('/delete/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.delete(tripId)
        .then(dbRes => response.json(`Trip deleted! ${tripId}`))
        .catch(err => response.json('Trip could not be deleted!'))
});

router.patch('/edit/:tripId', (request, response) => {
    return response.json('Editing trip...');
});

router.patch('/edit/activity/:activityId', (request, response) => {
    const activityId = request.params.activityId;
    const startDate = request.body.startDate;
    const endDate = request.body.endDate;
    const rating = request.body.rating;
    Trip.updateActivity(activityId, startDate, endDate, rating)
    .then(dbRes => response.json(`Activity ${activityId} updated successfully`))
    .catch(err => response.json(`Activity ${activityId} not updated`))
})

// ADD NEW TRIP
router.post('/', (request, response) => {
    const { tripId, placeId, name, city, country, startDate, endDate, rating, type } = request.body;

    // Save pathway for AIRLINE
    if (type === 'airline') {
        Trip.writeAirline(name, type)
            .then(() => {
                Trip.getAirline(name)
                    .then(dbRes => {
                        const airlineId = dbRes.rows[0].id;
                        console.log(`~~~~~ AIRLINE ACTIVITY ID: ${airlineId} ~~~~~`)
                        Trip.writeAirlineLocation(tripId)
                            .then(() => {
                                Trip.getAirlineLocation(tripId)
                                    .then(dbRes => {
                                        const locationId = dbRes.rows[0].id;
                                        console.log(`~~~~~ AIRLINE LOCATION ID: ${locationId} ~~~~~`)
                                        Trip.writeAirlineItinItem(locationId, airlineId, startDate, rating)
                                            .then(() => {
                                                Trip.getAirlineItinItem(locationId, airlineId, startDate)
                                                    .then(dbRes => {
                                                        const itinItemId = dbRes.rows[0].id;
                                                        console.log(`~~~~~ ITINERARY ITEM ID: ${itinItemId} ~~~~~`)
                                                        return response.json({itineraryId: itinItemId})
                                                    })


                                            })

                                    })
                            })
                    })
            })
            .catch(err => console.log('CRASH DETECTED WHEN SAVING DATA - CHECK LINE ABOVE'))
    } else {
    // Save pathway for HOTEL & ACTIVITY
    Trip.writeCountry(country)
        .then(() => {
            Trip.getCountry(country)
                .then(dbRes => {
                   const countryId = dbRes.rows[0].id;
                    console.log(`~~~~~ COUNTRY ID: ${countryId} ~~~~~`)
                    const gm_api_city_id = city + country;
                    Trip.writeCity(countryId, gm_api_city_id, city)
                        .then(() => {
                            Trip.getCity(city)
                                .then(dbRes => {
                                    const cityId = dbRes.rows[0].id;
                                    console.log(`~~~~~ CITY ID: ${cityId} ~~~~~`)
                                    Trip.writeLocation(tripId, cityId)
                                        .then(() => {
                                            Trip.getLocation(tripId, cityId)
                                                .then(dbRes => {
                                                    const locationId = dbRes.rows[0].id;
                                                    console.log(`~~~~~ LOCATION ID: ${locationId} ~~~~~`)
                                                    Trip.writeActivity(name, placeId, type)
                                                        .then(() => {
                                                            Trip.getActivity(placeId)
                                                                .then(dbRes => {
                                                                    const activityId = dbRes.rows[0].id;
                                                                    console.log(`~~~~~ ACTIVITY ID: ${activityId} ~~~~~`)
                                                                    Trip.writeItinItem(locationId, activityId, startDate, endDate, rating)
                                                                        .then(() => {
                                                                            Trip.getItinItem(locationId, activityId, startDate)
                                                                                .then(dbRes => {
                                                                                    const itinItemId = dbRes.rows[0].id;
                                                                                    console.log(`~~~~~ ITINERARY ITEM ID: ${itinItemId} ~~~~~`)
                                                                                    return response.json({itineraryId: itinItemId})
                                                                                })
                                                                        })
                                                                })
                                                        })
                                                })

                                        })
                                })
                        })
                })
        })
        .catch(err => console.log('CRASH DETECTED WHEN SAVING DATA - CHECK LINE ABOVE'))
    }
})


// STATIC FIELDS SAVE ON BLUR
router.patch('/static', (request, response) => {
    const { route, userInput, tripId } = request.body;
    Trip.write(route, userInput, tripId)
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.json(err))
})


module.exports = router;