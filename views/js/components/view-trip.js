const viewTrip = (id) => {
    const pageContainer = document.getElementById('page-container');
    // emptying container to remove old content
    pageContainer.innerHTML = '';

    // add CSS to below elements
    const tripHeader = document.createElement('h1');
    const tripSubHeader = document.createElement('h4');
    const coverPhoto = document.createElement('img');
    const descriptionContainer = document.createElement('div');
    const descriptionContent = document.createElement('p');
    const flightLogo = document.createElement('img');
    const hotelLogo = document.createElement('img');
    const activities = document.createElement('div');
    const activityDetails = document.createElement('h5');
    const activityLogo = document.createElement('img');
    // placeholder activity name, start date, end date
    activityDetails.innerHTML = `
    <p>Brisbane Snowboarding</p>
    <p>30/1/2019 - 31/1/2019</p>
    `;
    activityLogo.src = '../assets/clipboard-list-solid.svg';

    coverPhoto.className = 'trip-page-cover-pic';
    activities.className = 'itinerary-row';
    activityDetails.className = 'itinerary-item-details';
    activityLogo.className = 'trip-addon-icon';

    let p = new Promise((resolve, reject) => {
        axios.get(`/tripDetails/tripName/${id}`)
            .then(response => {
                const timeStampStart = new Date(response.data.trip_start_date);
                const timeStampEnd = new Date(response.data.trip_end_date);
                const beautifiedStartDate = `${timeStampStart.getDate()}/${timeStampStart.getMonth() + 1}/${timeStampStart.getFullYear()}`;
                const beautifiedEndDate = `${timeStampEnd.getDate()}/${timeStampEnd.getMonth() + 1}/${timeStampEnd.getFullYear()}`;
                tripSubHeader.textContent = beautifiedStartDate + ' - ' + beautifiedEndDate;
                tripHeader.textContent = response.data.trip_name;
                coverPhoto.src = response.data.hero_image_url;
                descriptionContent.innerHTML = `
                <h4>Description</h4>
                ${response.data.description}
                `;
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
        tripHeader.appendChild(tripSubHeader);
        descriptionContainer.appendChild(descriptionContent);
        activities.append(activityLogo, activityDetails);
        pageContainer.append(tripHeader, coverPhoto, descriptionContainer, activities);
    });
};

setTimeout(() => {
    viewTrip(1);
}, 2000);

// viewTrip(2);