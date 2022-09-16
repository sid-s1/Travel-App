import { dateExtractor } from './date-extractor.js';
import { renderProfile } from './profile.js';
import { likeDislikeAction } from './like-dislike.js';
import { createBookmarkIcon } from './bookmarks.js';
import { renderEditTripForm } from './edit-trip.js';
import { renderMyTrips } from './my-trips.js';

// if session does not return anything, display default trip view without modify buttons or like-dislike buttons

export const countVotes = (tripId) => {
    return axios.get(`/user/votes/${tripId}`)
        .then(response => response.data)
        .catch(err => console.log(err))
};


export const viewTrip = (id) => {
    const loggedInUserId = Number(localStorage.getItem('userId'));
    console.log(`logged in as user ${loggedInUserId} looking at trip ${id}`);
    let voteCount;

    const pageContainer = document.getElementById('page-container');
    // emptying container to remove old content
    pageContainer.innerHTML = '';

    // add CSS to below elements
    const tripHeader = document.createElement('div');
    const photoContainer = document.createElement('div');
    const likeDiv = document.createElement('div');
    const likeButton = document.createElement('span');
    const likeCount = document.createElement('span');
    const dislikeDiv = document.createElement('div');
    const dislikeButton = document.createElement('span');
    const dislikeCount = document.createElement('span');
    const coverPhoto = document.createElement('img');
    const descriptionContainer = document.createElement('div');
    const descriptionContent = document.createElement('p');
    const keyTakeaway = document.createElement('p');
    const activitiesContainer = document.createElement('div');

    const showcaseLikeButton = document.createElement('span');
    const showcasedislikeButton = document.createElement('span');
    let bookmark;

    showcaseLikeButton.innerHTML = `
    <i class="fa-thin fa-thumbs-up showcase-like-dislike-icons"></i>
    `;
    showcasedislikeButton.innerHTML = `
    <i class="fa-thin fa-thumbs-down showcase-like-dislike-icons"></i>
    `;

    const modifyTripContainer = document.createElement('div');
    const editTripButton = document.createElement('button');
    const deleteTripButton = document.createElement('button');

    editTripButton.textContent = 'Edit Trip';
    deleteTripButton.textContent = 'Delete Trip';

    countVotes(id)
        .then(countResponse => {
            voteCount = countResponse;

            likeDislikeAction(likeButton, dislikeButton, loggedInUserId, id);

            // adding classes to cover-photo and activities container (this container holds all itinerary item logos and details)
            coverPhoto.className = 'trip-page-cover-pic';
            activitiesContainer.className = 'itinerary-column';
            modifyTripContainer.id = 'modify-trip';
            editTripButton.id = 'edit-trip';
            deleteTripButton.id = 'delete-trip';
            likeDiv.id = 'like-container';
            dislikeDiv.id = 'dislike-container';
            likeCount.id = 'like-count';
            dislikeCount.id = 'dislike-count';
            showcaseLikeButton.id = 'showcase-like-btn';
            showcasedislikeButton.id = 'showcase-dislike-btn';

            // creating a promise so that when the API calls are made, the data is received and the HTML elements are filled, no appending to the body happens until the promise is fulfilled
            let p = new Promise((resolve, reject) => {
                axios.get(`/user/trips/${id}`)
                    .then(tripDetailsResponse => {
                        console.log(tripDetailsResponse.data);
                        // tripDetails will be an array of objects with trip title, description, status, start date, end date and cities visited for the trip id used in our axios call
                        const tripDetails = tripDetailsResponse.data;

                        const userIdForTrip = tripDetails[0].user_id;

                        // using an imported function to perform date cleanup as DB storage of date includes time
                        const formattedStartDate = dateExtractor.formatDate(tripDetails[0].trip_start_date);
                        const formattedEndDate = dateExtractor.formatDate(tripDetails[0].trip_end_date);
                        const citiesForHeader = document.createElement('p');

                        tripHeader.innerHTML = `
                                <h4>${tripDetails[0].trip_name}</h4>
                                <h5>${formattedStartDate} - ${formattedEndDate}</h5>
                                `;

                        // INSERT BOOKMARK
                        createBookmarkIcon(id)
                            .then(response => tripHeader.appendChild(response))
                            .catch(err => console.log('bookmark promise not here'))

                        coverPhoto.src = tripDetails[0].hero_image_url;

                        if (tripDetails[0].trip_status === 'draft') {
                            const draftStatus = document.createElement('h2');
                            draftStatus.textContent = 'DRAFT';
                            modifyTripContainer.appendChild(draftStatus);
                        }

                        if (loggedInUserId === userIdForTrip) {
                            modifyTripContainer.append(editTripButton, deleteTripButton);
                        }
                        likeCount.textContent = `+ ${voteCount.likes}`;
                        dislikeCount.textContent = `- ${voteCount.dislikes}`;

                        if (loggedInUserId) {
                            likeDiv.append(likeButton, likeCount);
                            dislikeDiv.append(dislikeButton, dislikeCount);
                            photoContainer.append(likeDiv, coverPhoto, dislikeDiv);
                            photoContainer.id = 'likeDislike-and-coverPhoto';
                        }
                        else {
                            likeDiv.append(showcaseLikeButton, likeCount);
                            dislikeDiv.append(showcasedislikeButton, dislikeCount);
                            photoContainer.append(likeDiv, coverPhoto, dislikeDiv);
                            photoContainer.id = 'likeDislike-and-coverPhoto';
                        }

                        editTripButton.addEventListener('click', () => {
                            renderEditTripForm(id);
                        })
                        deleteTripButton.textContent = 'Delete';

                        deleteTripButton.addEventListener('click', (e) => {

                            if (e.target.textContent == 'Delete') {
                                e.target.textContent = 'Confirm';
                                e.target.classList.add('confirm-delete');
                                setTimeout(() => {
                                    e.target.textContent = 'Delete';
                                    e.target.classList.remove('confirm-delete');
                                }, 3000)
                            }
                            else {
                                axios.delete(`/user/trips/delete/${id}`)
                                    .then(response => {
                                        renderMyTrips();
                                    })
                                    .catch(err => console.log(err))
                            }
                        })

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
                    .catch(error => console.log(error))

                axios.get(`/user/trips/activities/${id}`)
                    .then(activityResponse => {
                        const activities = activityResponse.data;
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

                            if (activity.gm_type === 'activity') {
                                activityLogo.src = '../assets/clipboard-list-solid.svg';
                            }
                            else if (activity.gm_type === 'airline') {
                                activityLogo.src = '../assets/jet-fighter-up-solid.svg';
                            }
                            else if (activity.gm_type === 'hotel') {
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
                pageContainer.append(tripHeader, modifyTripContainer, photoContainer, descriptionContainer, keyTakeaway, activitiesContainer);
            })
                .catch(err => console.log(err))

        })
};