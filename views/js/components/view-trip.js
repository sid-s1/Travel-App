const viewTrip = (id) => {
    const pageContainer = document.getElementById('page-container');
    // emptying container to remove old content
    pageContainer.innerHTML = '';
    const tripHeader = document.createElement('h2');
    axios.get(`/tripDetails/tripName/${id}`)
        .then(response => {
            tripHeader.textContent = response.data.trip_name;
        })
        .catch(error => { })
    axios.get(`/tripDetails/tripCities/${id}`)
        .then(response => {
            console.log('here', response);
            tripHeader.textContent += ` - ${response.data.city_name}`;
        })
        .catch(error => { })
    pageContainer.appendChild(tripHeader);
};

setTimeout(() => {
    viewTrip(1);
}, 2000);

// viewTrip(2);