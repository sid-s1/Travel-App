const express = require('express');
const router = express.Router();
const Trip = require('../models/tripDetails');
const extractValuesFromArrObjects = require('../util/extractCityIds');

router.get('/tripName/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.details(tripId)
        .then(dbRes => {
            const tripDetailsObj = dbRes.rows[0];
            return response.json(tripDetailsObj);
        })
});

router.get('/tripCities/:tripId', (request, response) => {
    const tripId = request.params.tripId;
    Trip.cityId(tripId)
        .then(dbRes => {

            if (dbRes.length > 1) {
                const cityIdArr = extractValuesFromArrObjects(dbRes);
                Trip.cityNames(cityIdArr)
                    .then(dbRes => {
                        const cityNames = extractValuesFromArrObjects(dbRes.rows);
                        return response.json(cityNames)
                    })
            }

            else {
                Trip.cityName(dbRes.city_id)
                    .then(dbRes2 => {
                        console.log(dbRes2);
                        return response.json(dbRes2.rows[0].city_name)
                    })
            }

        })
});

module.exports = router;



// dbRes.rows =>
// [
//   {
//     id: 2,
//     user_id: 2,
//     trip_name: 'European summer escape',
//     trip_type: 'leisure',
//     trip_status: 'draft',
//     trip_start_date: 2021-06-21T14:00:00.000Z,
//     trip_end_date: 2021-07-02T14:00:00.000Z,
//     hero_image_url: 'https://images.unsplash.com/photo-1595704313515-e345a1cbdaa2',
//     description: 'Summer in Italy and France.',
//     key_takeaway: 'I like Gelato.'
//   }
// ]