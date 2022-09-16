export function initAutocomplete(element, type) {
    let data = {};
    if (type === 'hotel') {
        data.types = ['lodging']
    };
    data.fields = ['place_id', 'geometry', 'name'];

    return new google.maps.places.Autocomplete(element, data);
}
export function initAutocompleteActivities() {}
export function initAutocompleteHotels() {}