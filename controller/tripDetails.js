const express = require('express');
const router = express.Router();
const Trip = require('../models/tripDetails');

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
            // console.log(dbRes.city_id);
            // const tripCitiesObj = dbRes.rows[0];
            // return response.json(tripCitiesObj);

            Trip.cityNames(dbRes.city_id)
                .then(dbRes => {
                    console.log(dbRes.rows[0].city_name);
                    return {}
                })



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