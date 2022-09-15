const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');

router.get('/:place', (request, response) => {
    // get place string from front end
    let place = request.params.place;
    const placeTrial = `${place.split(',')[0]},${place.split(',')[1]}`;
    // console.log(`${place.split(',')[0]}, ${place.split(',')[0]}`);

    // place = place.replaceAll(' ', '%20');
    // place = place.replaceAll(',', '%2C');
    place = encodeURIComponent(place);

    const placeDetails = {};

    // use place string to get place id 
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&key=${process.env.api_key}`)
        .then(googleResponse => {
            const place_id = googleResponse.data.results[0].place_id;
            // console.log(place_id);
            // store place id into db for that store/activity - COMPLETE AFTER ADD TRIP PAGE
            placeDetails['country'] = '';
            placeDetails['placeId'] = place_id;
            placeDetails['name'] = placeTrial;
            // use place id to get place details like country
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.api_key}`)
                .then(placeResponse => {
                    for (const component of placeResponse.data.result.address_components) {
                        if (component.types.includes('country')) {
                            placeDetails['country'] = component.long_name;
                        }
                        if (component.types.includes('locality')) {
                            placeDetails['city'] = component.long_name;
                        }
                    }
                    // console.log(placeResponse.data.result.address_components);
                    // console.log(country);
                    console.log(placeDetails);
                    return response.json({ location: placeDetails })
                })
        })
        .catch(error => console.log(error))
});

module.exports = router;