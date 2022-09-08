const viewTrip = (id) => {
    const pageContainer = document.getElementById('page-container');
    // emptying container to remove old content
    pageContainer.innerHTML = '';
    const tripHeader = document.createElement('h2');

    let p = new Promise((resolve, reject) => {
        axios.get(`/tripDetails/tripName/${id}`)
            .then(response => {
                tripHeader.textContent = response.data.trip_name;
            })
            .catch(error => { })
        axios.get(`/tripDetails/tripCities/${id}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    tripHeader.textContent += ` - ${response.data.join(', ')}`;
                }
                else {
                    tripHeader.textContent += ` - ${response.data}`;
                }
                resolve();
            })
            .catch(error => { })
    });
    p.then(() => {
        pageContainer.appendChild(tripHeader);
    });
};

setTimeout(() => {
    viewTrip(1);
}, 2000);

// viewTrip(2);