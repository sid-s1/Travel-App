import { dateExtractor } from './date-extractor.js';
import { renderProfile } from './profile.js';

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

    const modifyTripContainer = document.createElement('div');
    const editTripButton = document.createElement('button');
    const deleteTripButton = document.createElement('button');

    editTripButton.textContent = 'Edit Trip';
    deleteTripButton.textContent = 'Delete Trip';

    // adding classes to cover-photo and activities container (this container holds all itinerary item logos and details)
    coverPhoto.className = 'trip-page-cover-pic';
    activitiesContainer.className = 'itinerary-column';
    modifyTripContainer.id = 'modify-trip';
    editTripButton.id = 'edit-trip';
    deleteTripButton.id = 'delete-trip';

    // creating a promise so that when the API calls are made, the data is received and the HTML elements are filled, no appending to the body happens until the promise is fulfilled
    let p = new Promise((resolve, reject) => {
        axios.get(`/tripDetails/${id}`)
            .then(response => {
                // tripDetails will be an array of objects with trip title, description, status, start date, end date and cities visited for the trip id used in our axios call
                const tripDetails = response.data;

                // using an imported function to perform date cleanup as DB storage of date includes time
                const formattedStartDate = dateExtractor.formatDate(tripDetails[0].trip_start_date);
                const formattedEndDate = dateExtractor.formatDate(tripDetails[0].trip_end_date);
                const citiesForHeader = document.createElement('p');

                tripHeader.innerHTML = `
                <h4>${tripDetails[0].trip_name}</h4>
                <h5>${formattedStartDate} - ${formattedEndDate}</h5>
                `;

                coverPhoto.src = tripDetails[0].hero_image_url;

                if (tripDetails[0].trip_status === 'draft') {
                    const draftStatus = document.createElement('h2');
                    draftStatus.textContent = 'DRAFT';
                    modifyTripContainer.appendChild(draftStatus);
                }

                axios.get('/user/session')
                    .then(response => {
                        const result = response.data.rows[0];
                        const loggedInUserId = result.id;
                        const userIdForTrip = tripDetails[0].user_id;
                        if (loggedInUserId === userIdForTrip) {
                            modifyTripContainer.append(editTripButton, deleteTripButton);
                        }
                    })


                let deleteConfirmation = false;
                deleteTripButton.addEventListener('click', () => {

                    if (deleteConfirmation) {
                        axios.delete(`/modifyTrip/deleteTrip/${id}`)
                            .then(response => console.log(response.data))
                            .catch(err => console.log(err))

                        // NOTE - PASS renderProfile below WITH USER ID LOGGED IN
                        renderProfile(2);
                    }

                    else {
                        deleteConfirmation = true;
                        deleteTripButton.disabled = 'true';
                        deleteTripButton.textContent = 'Confirm delete?';
                        let startInterval = 5;

                        let confirmDeleteInterval = setInterval(() => {
                            deleteTripButton.textContent = `Confirm delete? ${startInterval}${'.'.repeat(startInterval)}`;
                            startInterval--;
                        }, 1000);

                        setTimeout(() => {
                            clearInterval(confirmDeleteInterval);
                            deleteTripButton.textContent = 'Confirm delete?';
                            deleteTripButton.removeAttribute('disabled');
                        }, 6000);
                    }
                });

                descriptionContent.innerHTML = `
                <h4>Description</h4>
                ${tripDetails[0].description}
                `;
                keyTakeaway.innerHTML = `
                <h4> | ${tripDetails[0].key_takeaway} | </h4>
                `;

                // adding city names that the user has visited in this trip; if it was the last city in the loop we do not need the final comma
                for (let iterator = 0; iterator < tripDetails.length; iterator++) {
                    if (iterator === tripDetails.length - 1) {
                        citiesForHeader.textContent += `${tripDetails[iterator].city_name}`;
                    }
                    else {
                        citiesForHeader.textContent += `${tripDetails[iterator].city_name}, `;
                    }
                }
                tripHeader.appendChild(citiesForHeader);
            })
            .catch(error => { })

        axios.get(`/tripDetails/tripActivites/${id}`)
            .then(response => {
                const activities = response.data;
                for (const activity of activities) {
                    // each activity will be an object of activity name, type, start date and end date for the trip id used in our axios call
                    const formattedStartDate = dateExtractor.formatDate(activity.activity_start_date);
                    const formattedEndDate = dateExtractor.formatDate(activity.activity_end_date);

                    const activitiesDiv = document.createElement('div');
                    const activityDetails = document.createElement('h5');
                    const activityLogo = document.createElement('img');

                    activitiesDiv.className = 'itinerary-row';
                    activityDetails.className = 'itinerary-item-details';
                    activityLogo.className = 'trip-addon-icon';

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
        pageContainer.append(tripHeader, modifyTripContainer, coverPhoto, descriptionContainer, keyTakeaway, activitiesContainer);
    })
        .catch(err => console.log(err))
};

setTimeout(() => {
    // Calling the function here; once we decide where user is clicking to view these trips, we can link those buttons to call viewTrip function with tripId as an argument

    // tripId 1 has been changed to 'posted' - itinerary items and cities have been added

    // tripId 2 shows as a 'draft' - some itinerary items and city have been added

    // viewTrip(1);
    viewTrip(6);
}, 500);