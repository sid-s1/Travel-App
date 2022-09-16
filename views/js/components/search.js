import { layout, pageContainer, page } from "./layout.js"
import { dateExtractor } from "./date-extractor.js"
import { viewTrip } from "./view-trip.js"
import { createBookmarkIcon } from "./bookmarks.js"
import { HtmlElements } from "./html-elements.js"
import { createFloatingElement } from "./new-trip.js"

export const renderSearchBar = () => {

    const searchByAllLabel = HtmlElements.createLabel('all', 'All');
    const searchByAll = HtmlElements.createInput('radio', 'search-type', 'all', 'search-bar-options', 'all', null, null, true);

    const searchByUserLabel = HtmlElements.createLabel('user', 'User');
    const searchByUser = HtmlElements.createInput('radio', 'search-type', 'user', 'search-bar-options', 'user');

    const searchByCityLabel = HtmlElements.createLabel('city', 'City');
    const searchByCity = HtmlElements.createInput('radio', 'search-type', 'city', 'search-bar-options', 'city');

    const searchByActivityLabel = HtmlElements.createLabel('activity', 'Activity');
    const searchByActivity = HtmlElements.createInput('radio', 'search-type', 'activity', 'search-bar-options', 'activity');

    const searchByCountryLabel = HtmlElements.createLabel('country', 'Country');
    const searchByCountry = HtmlElements.createInput('radio', 'search-type', 'country', 'search-bar-options', 'country');

    const searchTabs = layout.wrap([searchByAll, searchByAllLabel, searchByUser, searchByUserLabel, searchByCity, searchByCityLabel, searchByActivity, searchByActivityLabel, searchByCountry, searchByCountryLabel],'search-tabs')

    const form = document.createElement('form');
    form.id = 'search-form';

    const searchBar =  HtmlElements.createInput('text', 'search-bar', 'search-bar', null, null, 'Search...');

    const searchButton = HtmlElements.createButton('submit', '<i class="fa-regular fa-magnifying-glass"></i>', 'submit-search')
    searchButton.style.cursor = 'pointer';

    const searchType = HtmlElements.createInput('hidden', null, null);

    form.append(searchTabs, searchBar, searchType, searchButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        executeSearch(form);
    });

    const searchDiv = layout.wrap([form], 'search-div');
    return searchDiv;
}


export const executeSearch = (form) => {
    const formData = new FormData(form);
    const data = {
        searchString: formData.get('search-bar'),
        searchType: formData.get('search-type')
      };
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    axios.post('/search', data)
    .then((dbRes) => {
        const results = renderResults(dbRes.data, data.searchString, data.searchType);
        resultsContainer.appendChild(results);
    })
    .catch((err) => {
        console.log(err);
    })
}

export const renderResults = (data, searchString, searchType) => {
    // data is an object of arrays: 'users', 'trips', 'cities', 'activites' (& 'user_id' single variable).
    // searchString is a string in most cases and a username in the case of the 'bookmarks'
    // searchType passes in what type of search, but in some cases is also used to denote 'my-trips' or 'bookmarks' etc
    const user_id = data.user_id;
    const resultsHeading = document.createElement('h2');
    resultsHeading.id = 'results-heading';
    const resultsCount = document.createElement('p');
    resultsCount.id = 'results-count';
    const resultsContainer = layout.wrap([resultsHeading,resultsCount],'results')
    if (searchType === 'user') {
        resultsHeading.textContent = `Search for '${searchString}' in Users:`;
        resultsCount.textContent = `${data.users.length} results found`;
        const arrUser = renderUsers(data.users);
        for (let i = 0; i < arrUser.length; i++) {
            resultsContainer.appendChild(arrUser[i]);
        }
    } else if (searchType === 'city' || searchType === 'country') {
        if (searchType === 'city') {
            resultsHeading.textContent = `Search for '${searchString}' in Cities:`;
        } else if (searchType === 'country') {
            resultsHeading.textContent = `Search for '${searchString}' in Countries:`;
        }
        const tripInfo = renderTrips(data, 'search');
        let tripsLength = 0;
        for (let i = 0; i < tripInfo.tripData.length; i++) {
            if (tripInfo.tripData[i].trip_status === 'posted') {
                tripsLength++;
            } else if (tripInfo.tripData[i].trip_status === 'draft') {
                if (user_id && (tripInfo.tripData[i].user_id === user_id)) {
                    tripsLength++;
                }
            }
        }
        resultsCount.textContent = `${tripsLength} results found`;
        for (let i = 0; i < tripInfo.resultsCont.length; i++) {
            resultsContainer.appendChild(tripInfo.resultsCont[i]);
        }
    } else if (searchType === 'activity') {
        resultsHeading.textContent = `Search for '${searchString}' in Activies:`;
        resultsCount.textContent = `${data.activities.length} results found`;
        const arrAct = renderActivities(data.activities);
        for (let i = 0; i < arrAct.length; i++) {
            resultsContainer.appendChild(arrAct[i]);
        }
    } else if (searchType === 'all') {
        resultsHeading.textContent = `Search for '${searchString}' in all categories:`;
        const tripInfo = renderTrips(data, 'search');
        let tripsLength = 0;
        for (let i = 0; i < tripInfo.tripData.length; i++) {
            if (tripInfo.tripData[i].trip_status === 'posted') {
                tripsLength++;
            } else if (tripInfo.tripData[i].trip_status === 'draft') {
                if (user_id && (tripInfo.tripData[i].user_id === user_id)) {
                    tripsLength++;
                }
            }
        }
        for (let i = 0; i < tripInfo.resultsCont.length; i++) {
            resultsContainer.appendChild(tripInfo.resultsCont[i]);
        }
        const arrUser = renderUsers(data.users);
        for (let i = 0; i < arrUser.length; i++) {
            resultsContainer.appendChild(arrUser[i]);
            tripsLength++;
        }
        const arrAct = renderActivities(data.activities);
        for (let i = 0; i < arrAct.length; i++) {
            resultsContainer.appendChild(arrAct[i]);
            tripsLength++;
        }
        resultsCount.textContent = `${tripsLength} results found`;
    } else if (searchType === 'my-trips') {
        resultsHeading.textContent = `My Trips`;
        const tripInfo = renderTrips(data, 'my-trips');
        for (let i = 0; i < tripInfo.resultsCont.length; i++) {
            resultsContainer.appendChild(tripInfo.resultsCont[i]);
        }
    } else if (searchType === 'bookmarks') {
        resultsHeading.textContent = `Bookmarks`;
        const tripInfo = renderTrips(data.data, 'bookmarks');
        for (let i = 0; i < tripInfo.resultsCont.length; i++) {
            resultsContainer.appendChild(tripInfo.resultsCont[i]);
        }
    }
    return resultsContainer;
}

export const renderTrips = (data, appLocation) => {
    const returnObj = {
        resultsCont: [],
        tripData: []
    }
    const user_id = data.user_id;
    const loggedInUserId = localStorage.getItem('userId');
    // add all data that is unique to that trip into a new object
    for (let i=0; i < data.trips.length; i++) {
        const idCheck = (trip) => trip.trip_id === data.trips[i].id;
        if (!returnObj.tripData.some(idCheck)) {
            const obj = {
                trip_id: data.trips[i].id,
                trip_user_id: data.trips[i].user_id,
                trip_name: data.trips[i].trip_name,
                trip_descr: data.trips[i].description,
                trip_status: data.trips[i].trip_status,
                trip_start_date: data.trips[i].trip_start_date,
                trip_end_date: data.trips[i].trip_end_date,
            }
        returnObj.tripData.push(obj);  // add that object to the returnObj.tripData array
        }
    }
    // run through data again and for each trip, add all city names as an array under the key 'trip_cities'
    for (let i=0; i < data.trips.length; i++) {
        const trip = returnObj.tripData.find(item => item.trip_id === data.trips[i].id);
        if (trip.trip_cities) {
            trip.trip_cities.push(data.trips[i].city_name)
        } else {
            trip.trip_cities = [data.trips[i].city_name]
        }
    }
    // run through data once more and for each trip add all country names as an array under the key 'trip_countries'
    for (let i=0; i < data.trips.length; i++) {
        const trip = returnObj.tripData.find(item => item.trip_id === data.trips[i].id);
        if (trip.trip_countries) {
            if (trip.trip_countries != data.trips[i].country_name) {
                trip.trip_countries.push(data.trips[i].country_name)
            }
        } else {
            trip.trip_countries = [data.trips[i].country_name]
        }
    }
    // check if user is logged in - if so, and if search is used for users own trips, allow 'draft' trips to be shown.
        returnObj.tripData.forEach(row => {
            if (appLocation === 'search') {
                // Functionality for public-homepage.js & explore.js
                // ONLY SHOW POSTED
                if (row.trip_status === 'posted') {
                    const tripContainer = document.createElement('div');
                    tripContainer.className = 'trip-result';
                    const cityConversion = row.trip_cities.toString();
                    const countryConversion = row.trip_countries.toString();
                    const cities = cityConversion.replace(/,/g, ', ');
                    const countries = countryConversion.replace(/,/g, ', ');
                    const startDate = dateExtractor.formatDate(row.trip_start_date);
                    const endDate = dateExtractor.formatDate(row.trip_end_date);
                    tripContainer.innerHTML = `
                    <h2><i class="fa-light fa-suitcase"></i>  ${row.trip_name} - ${countries}</h2>
                    <h3>${cities}</h3>
                    <h3>${startDate} to ${endDate}</h3>
                    <p>${row.trip_descr}</p>`
                    tripContainer.addEventListener('click', () => {
                        if (user_id) {
                            renderSearchBar(page);
                        }
                        viewTrip(row.trip_id);
                    })
                    tripContainer.id = `trip${row.trip_id}`;

                    if (loggedInUserId) {

                        createBookmarkIcon(row.trip_id)
                            .then(response => {
                                createFloatingElement(tripContainer, response.innerHTML, 'bookmark-float')
                                })
                            .catch(err => console.log('bookmark promise not here'))
                    }

                    returnObj.resultsCont.push(tripContainer);
                }
            } else if (appLocation === 'my-trips') {
                // Functionality for my-trips.js
                // SHOW POSTED AND DRAFTS
            if (row.trip_status === 'posted') {
                const tripContainer = document.createElement('div');
                tripContainer.className = 'trip-result';
                const cityConversion = row.trip_cities.toString();
                const countryConversion = row.trip_countries.toString();
                const cities = cityConversion.replace(/,/g, ', ');
                const countries = countryConversion.replace(/,/g, ', ');
                const startDate = dateExtractor.formatDate(row.trip_start_date);
                const endDate = dateExtractor.formatDate(row.trip_end_date);
                tripContainer.innerHTML = `
                <h2><i class="fa-light fa-suitcase"></i>  ${row.trip_name} - ${countries}</h2>
                <h3>${cities}</h3>
                <h3>${startDate} to ${endDate}</h3>
                <p>${row.trip_descr}</p>
                `
                tripContainer.addEventListener('click', () => {
                    viewTrip(row.trip_id);
                })
                tripContainer.id = `trip${row.trip_id}`;
                returnObj.resultsCont.push(tripContainer);
            } else if (row.trip_status === 'draft') {
                const tripContainer = document.createElement('div');
                tripContainer.className = 'trip-result';
                const cityConversion = row.trip_cities.toString();
                const countryConversion = row.trip_countries.toString();
                const cities = cityConversion.replace(/,/g, ', ');
                const countries = countryConversion.replace(/,/g, ', ');
                const startDate = dateExtractor.formatDate(row.trip_start_date);
                const endDate = dateExtractor.formatDate(row.trip_end_date);
                tripContainer.innerHTML = `
                <h2><i class="fa-light fa-suitcase"></i>  ${row.trip_name} - ${countries} (${row.trip_status})</h2>
                <h3>${cities}</h3>
                <h3>${startDate} to ${endDate}</h3>
                <p>${row.trip_descr}</p>
                `
                tripContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewTrip(row.trip_id);
                })
                tripContainer.id = `trip${row.trip_id}`;
                returnObj.resultsCont.push(tripContainer);
            }
            } else if (appLocation === 'bookmarks') {
                // Functionality for bookmarks.js
                // SHOW ONLY POSTED BOOKMARKS
                if (row.trip_status === 'posted') {
                    const tripContainer = document.createElement('div');
                    tripContainer.className = 'trip-result';
                    const cityConversion = row.trip_cities.toString();
                    const countryConversion = row.trip_countries.toString();
                    const cities = cityConversion.replace(/,/g, ', ');
                    const countries = countryConversion.replace(/,/g, ', ');
                    const startDate = dateExtractor.formatDate(row.trip_start_date);
                    const endDate = dateExtractor.formatDate(row.trip_end_date);
                    tripContainer.innerHTML = `
                    <h2><i class="fa-light fa-suitcase"></i>  ${row.trip_name} - ${countries}</h2>
                    <h3>${cities}</h3>
                    <h3>${startDate} to ${endDate}</h3>
                    <p>${row.trip_descr}</p>
                    `
                    tripContainer.addEventListener('click', () => {
                        viewTrip(row.trip_id);
                    })
                    tripContainer.id = `trip${row.trip_id}`;
                    returnObj.resultsCont.push(tripContainer);
                }
            }
        });
        return returnObj;
}


const renderUsers = (data) => {
    const resultsArr = [];

    data.forEach(row => {
        const userContainer = document.createElement('div');
        userContainer.className = 'user-result';
        userContainer.innerHTML = `
        <h2><i class="fa-light fa-user"></i>  ${row.username}</h2>
        <p>Trips: ${row.trip_count}</p>
        <p>Countries: ${row.country_count}</p>
        <p>Achievements: ${row.achievement_count}</p>
        `
        userContainer.addEventListener('click', () => {
            console.log(`${row.username} clicked`);
            // PLACE USER LINK HERE
        })
        resultsArr.push(userContainer);
    });
    return resultsArr;
}

const renderActivities = (data) => {
    const resultsArr = [];
    data.forEach(row => {
        let icon = ''
        switch (row.gm_type) {
            case 'airline':
                icon = '<i class="fa-light fa-plane-departure"></i>'
                break;
            case 'hotel':
                icon = '<i class="fa-light fa-hotel"></i>'
                break;
            case 'activity':
                icon = '<i class="fa-regular fa-calendar-star"></i>'
                break;
            default:
                break;
        }
        const activityContainer = document.createElement('div');
        activityContainer.className = 'activity-result';
        activityContainer.innerHTML = `
        <h2>${icon}  ${row.activity_name}</h2>
        <p>Activity details</p>
        `
        activityContainer.addEventListener('click', () => {
            console.log(`activity ${row.activity_name} clicked`);
            console.log(row);
            // PLACE ACTIVITY LINK HERE
        })
        resultsArr.push(activityContainer);
    });
    return resultsArr;
}