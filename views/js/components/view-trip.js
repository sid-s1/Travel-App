import { dateExtractor } from './dateExtractor.js';

const viewTrip = (id) => {
    const pageContainer = document.getElementById('page-container');
    // emptying container to remove old content
    pageContainer.innerHTML = '';

    // add CSS to below elements
    const tripHeader = document.createElement('div');
    const coverPhoto = document.createElement('img');
    const descriptionContainer = document.createElement('div');
    const descriptionContent = document.createElement('p');
    const keyTakeaway = document.createElement('p');
    const activitiesContainer = document.createElement('div');

    coverPhoto.className = 'trip-page-cover-pic';
    activitiesContainer.className = 'itinerary-column';

    let p = new Promise((resolve, reject) => {
        axios.get(`/tripDetails/tripName/${id}`)
            .then(response => {
                const formattedStartDate = dateExtractor.formatDate(response.data.trip_start_date);
                const formattedEndDate = dateExtractor.formatDate(response.data.trip_end_date);

                tripHeader.innerHTML = `
                <h4>${response.data.trip_name}</h4>
                <h5>${formattedStartDate} - ${formattedEndDate}</h5>
                `;

                coverPhoto.src = response.data.hero_image_url;
                descriptionContent.innerHTML = `
                <h4>Description</h4>
                ${response.data.description}
                `;
                keyTakeaway.innerHTML = `
                <h4> | ${response.data.key_takeaway} | </h4>
                `;
            })
            .catch(error => { })
        axios.get(`/tripDetails/tripCities/${id}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    const citiesForHeader = document.createElement('p');
                    citiesForHeader.textContent = response.data.join(', ');
                    tripHeader.appendChild(citiesForHeader);
                    // previously I added to content directly but that was spoiling the css
                    // tripHeader.textContent += ` - ${response.data.join(', ')}`;
                }
                else {
                    const cityForHeader = document.createElement('p');
                    cityForHeader.textContent = response.data;
                    tripHeader.appendChild(cityForHeader);
                    // previously I added to content directly but that was spoiling the css
                    // tripHeader.textContent += ` - ${response.data}`;
                }
            })
            .catch(error => { })
        axios.get(`/tripDetails/tripActivites/${id}`)
            .then(response => {
                const activities = response.data;
                for (const activity of activities) {
                    const formattedStartDate = dateExtractor.formatDate(activity.activity_start_date);
                    const formattedEndDate = dateExtractor.formatDate(activity.activity_end_date);

                    const activitiesDiv = document.createElement('div');
                    const activityDetails = document.createElement('h5');
                    const activityLogo = document.createElement('img');

                    activitiesDiv.className = 'itinerary-row';
                    activityDetails.className = 'itinerary-item-details';
                    activityLogo.className = 'trip-addon-icon';

                    console.log(activity.gm_type);

                    if (activity.gm_type === 'Business') {
                        activityLogo.src = '../assets/clipboard-list-solid.svg';
                    }
                    else if (activity.gm_type === 'Flight') {
                        activityLogo.src = '../assets/jet-fighter-up-solid.svg';
                    }
                    else if (activity.gm_type === 'Hotel') {
                        activityLogo.src = '../assets/bed-solid.svg';
                    }
                    activityDetails.innerHTML = `
                    <p>${activity.activity_name}</p>
                    <p>${formattedStartDate} - ${formattedEndDate}</p>
                    `;

                    activitiesDiv.append(activityLogo, activityDetails);
                    activitiesContainer.appendChild(activitiesDiv);
                }
                resolve();
            })
            .catch(error => reject(error))
    });
    p.then(() => {
        descriptionContainer.appendChild(descriptionContent);
        pageContainer.append(tripHeader, coverPhoto, descriptionContainer, keyTakeaway, activitiesContainer);
    })
        .catch(err => console.log(err))
};

setTimeout(() => {
    viewTrip(1);
}, 2000);

// viewTrip(2);