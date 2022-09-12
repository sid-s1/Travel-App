function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('input-box'), // use the input box query selector where we want autocomplete
        {
            // removed 'types' and 'componentRestrictions' keys so as to not restrict users in entering any kind of place/activity
            fields: ['place_id', 'geometry', 'name'] // see what more we can get
        }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
    function onPlaceChanged() {
        const value = document.getElementById('input-box').value;
        axios.get(`/placeDetails/${value}`)
            .then(response => console.log(response))
            .catch(err => console.log(error))
    }
}