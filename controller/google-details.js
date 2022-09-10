const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/:place', (request, response) => {
    // get place string from front end
    let place = request.params.place;

    place = place.replaceAll(' ', '%20');
    place = place.replaceAll(',', '%2C');

    console.log(place);

    // use place string to get place id 
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${process.env.api_key}`)
        .then(response => {
            const place_id = response.data.results[0].place_id;
            const placeDetails = {};
            placeDetails['country'] = '';
            placeDetails['place_id'] = place_id;
            // store place id into db for that store/activity - COMPLETE AFTER ADD TRIP PAGE
            // use place id to get place details like country
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.api_key}`)
                .then(response => {
                    for (const component of response.data.result.address_components) {
                        if (component.types.includes('country')) {
                            placeDetails['country'] = component.long_name;
                        }
                    }
                    console.log(response.data.result.address_components);
                    console.log(country);
                })
            response.json(placeDetails)
        })
        .catch(error => console.log(error))
});

module.exports = router;