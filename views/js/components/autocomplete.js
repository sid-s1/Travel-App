export function initAutocompleteHotels(element) {
    const autocomplete = new google.maps.places.Autocomplete(
        element, // use the input box query selector where we want autocomplete
        {
            types: ['lodging'],
            // removed 'types' and 'componentRestrictions' keys so as to not restrict users in entering any kind of place/activity
            fields: ['place_id', 'geometry', 'name'] // see what more we can get
        }
    );
    return autocomplete;
}

export function initAutocompleteActivities(element) {
    const autocomplete = new google.maps.places.Autocomplete(
        element, // use the input box query selector where we want autocomplete
        {
            // removed 'types' and 'componentRestrictions' keys so as to not restrict users in entering any kind of place/activity
            fields: ['place_id', 'geometry', 'name'] // see what more we can get
        }
    );
    return autocomplete;
}