import { layout, pageContainer } from "./layout.js"
import { dateExtractor } from "./date-extractor.js"
import { viewTrip } from "./view-trip.js"

export const renderSearchBar = (searchBarContainer) => {

    const searchByAllLabel = document.createElement('label');
    searchByAllLabel.setAttribute('for', 'all');
    searchByAllLabel.textContent = 'All';

    const searchByAll = document.createElement('input');
    searchByAll.type = 'radio';
    searchByAll.name = 'search-type';
    searchByAll.id = 'all';
    searchByAll.value = 'all';
    searchByAll.checked = true;

    const searchByUserLabel = document.createElement('label');
    searchByUserLabel.setAttribute('for', 'user');
    searchByUserLabel.textContent = 'User';

    const searchByUser = document.createElement('input');
    searchByUser.type = 'radio';
    searchByUser.name = 'search-type';
    searchByUser.id = 'user';
    searchByUser.value = 'user';
    searchByUser.checked = false;

    const searchByCityLabel = document.createElement('label');
    searchByCityLabel.setAttribute('for', 'city');
    searchByCityLabel.textContent = 'City';

    const searchByCity = document.createElement('input');
    searchByCity.type = 'radio';
    searchByCity.name = 'search-type';
    searchByCity.id = 'city';
    searchByCity.value = 'city';
    searchByCity.checked = false;

    const searchByActivityLabel = document.createElement('label');
    searchByActivityLabel.setAttribute('for', 'activity');
    searchByActivityLabel.textContent = 'Activity';

    const searchByActivity = document.createElement('input');
    searchByActivity.type = 'radio';
    searchByActivity.name = 'search-type';
    searchByActivity.id = 'activity';
    searchByActivity.value = 'activity';
    searchByActivity.checked = false;

    const searchByCountryLabel = document.createElement('label');
    searchByCountryLabel.setAttribute('for', 'country');
    searchByCountryLabel.textContent = 'Country';

    const searchByCountry = document.createElement('input');
    searchByCountry.type = 'radio';
    searchByCountry.name = 'search-type';
    searchByCountry.id = 'country';
    searchByCountry.value = 'country';
    searchByCountry.checked = false;

    const searchTabs = layout.wrap([searchByAll, searchByAllLabel, searchByUser, searchByUserLabel, searchByCity, searchByCityLabel, searchByActivity, searchByActivityLabel, searchByCountry, searchByCountryLabel],'search-tabs')

    const form = document.createElement('form');
    form.id = 'search-form';
    form.style.display = 'flex';
    form.style.justifyContent = 'space-between';
    form.style.columnGap = '20px';

    const searchBar =  document.createElement('input');
    searchBar.setAttribute("placeholder", "Search...");
    searchBar.id = "homepage-search-bar";
    searchBar.name = "homepage-search-bar";

    const searchButton = document.createElement('button');
    searchButton.innerHTML = '<i class="fa-regular fa-magnifying-glass"></i>'
    searchButton.type = 'submit';
    searchButton.id = 'submit-search';
    searchButton.style.cursor = 'pointer';

    const searchType = document.createElement('input');
    searchType.type = 'hidden';


    form.appendChild(searchTabs);
    form.appendChild(searchBar);
    form.appendChild(searchType);
    form.appendChild(searchButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        executeSearch(form);
    });

    const searchDiv = layout.wrap([form], 'search-div');


    searchBarContainer.appendChild(searchDiv);
}


const executeSearch = (form) => {
    const formData = new FormData(form);
    const data = {
        searchString: formData.get('homepage-search-bar'),
        searchType: formData.get('search-type')
      };
    pageContainer.innerHTML =''
    const resultsContainer = document.createElement('div')
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    axios.post('/search', data)
    .then((dbRes) => {
        renderResults(dbRes.data, data.searchString, data.searchType, resultsContainer);
    })
    .catch((err) => {
        console.log(err);
    })
}

const renderResults = (data, searchString, searchType, resultsContainer) => {
    const user_id = data.user_id;
    resultsContainer.innerHTML = '';
    const resultsHeading = document.createElement('h2');
    resultsHeading.id = 'results-heading';
    const resultsCount = document.createElement('p');
    resultsCount.id = 'results-count';
    resultsContainer.appendChild(resultsHeading);
    resultsContainer.appendChild(resultsCount);
    if (searchType === 'user') {
        document.getElementById('results-heading').textContent = `Search for '${searchString}' in Users:`;
        document.getElementById('results-count').textContent = `${data.users.length} results found`;
        renderUsers(data.users);
    } else if (searchType === 'city') {
        document.getElementById('results-heading').textContent = `Search for '${searchString}' in Cities:`;
            const tripArr = renderTrips(data, 'search');
            let tripsLength = 0
            for (let i = 0; i < tripArr.length; i++) {
                if (tripArr[i].trip_status === 'posted') {
                    tripsLength++;
                } else if (tripArr[i].trip_status === 'draft') {
                    if (user_id && (tripArr[i].user_id === user_id)) {
                        tripsLength++;
                    }
                }
            }
            document.getElementById('results-count').textContent = `${tripsLength} results found`;
    } else if (searchType === 'country') {
        document.getElementById('results-heading').textContent = `Search for '${searchString}' in Countries:`;
        if (data.length === 0) {
            document.getElementById('results-count').textContent = '0 results found';
        } else {
            const tripArr = renderTrips(data, 'search');
            const tripsLength = tripArr.length
            document.getElementById('results-count').textContent = `${tripsLength} results found`;
        }
    } else if (searchType === 'activity') {
        document.getElementById('results-heading').textContent = `Search for '${searchString}' in Activies:`;
        document.getElementById('results-count').textContent = `${data.length} results found`;
        renderActivities(data);
    } else if (searchType === 'all') {
        document.getElementById('results-heading').textContent = `Search for '${searchString}' in all categories:`;
        const tripArr = renderTrips(data.trips, 'search');
        renderUsers(data.users);
        renderActivities(data.activites);
        let tripsLength = 0;
        tripArr.forEach(trip => {
            if (trip.trip_status === 'posted') {
                tripsLength++;
            }
        });
        const searchResultsLength = data.users.length + data.activites.length + tripsLength;
        document.getElementById('results-count').textContent = `${searchResultsLength} results found`;
    }
}

export const renderTrips = (data, appLocation) => {
    const resultsDiv = document.getElementById('results');
    const tripArr = []
    const user_id = data.user_id; // ***FOR TESTING - REMOVE ONCE USER ID PASSED TO CLIENT ***
    // add all data that is unique to that trip into a new object
    for (let i=0; i < data.trips.length; i++) {
        const idCheck = (trip) => trip.trip_id === data.trips[i].id;
        if (!tripArr.some(idCheck)) {
            const obj = {
                trip_id: data.trips[i].id,
                trip_name: data.trips[i].trip_name,
                trip_descr: data.trips[i].description,
                trip_status: data.trips[i].trip_status,
                trip_start_date: data.trips[i].trip_start_date,
                trip_end_date: data.trips[i].trip_end_date,
            }
        tripArr.push(obj);  // add that object to the tripArr array
        }
    }
    // run through data again and for each trip, add all city names as an array under the key 'trip_cities'
    for (let i=0; i < data.trips.length; i++) {
        const trip = tripArr.find(item => item.trip_id === data.trips[i].id);
        if (trip.trip_cities) {
            trip.trip_cities.push(data.trips[i].city_name)
        } else {
            trip.trip_cities = [data.trips[i].city_name]
        }
    }
    // run through data once more and for each trip add all country names as an array under the key 'trip_countries'
    for (let i=0; i < data.trips.length; i++) {
        const trip = tripArr.find(item => item.trip_id === data.trips[i].id);
        if (trip.trip_countries) {
            if (trip.trip_countries != data.trips[i].country_name) {
                trip.trip_countries.push(data.trips[i].country_name)
            }
        } else {
            trip.trip_countries = [data.trips[i].country_name]
        }
    }
    // check if user is logged in - if so, and if search is used for users own trips, allow 'draft' trips to be shown.
        tripArr.forEach(row => {
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
                    console.log(`Trip id '${row.trip_id}' clicked`);
                    viewTrip(row.trip_id);
                })
                tripContainer.id = `trip${row.trip_id}`;
                resultsDiv.appendChild(tripContainer);
            } else if (row.trip_status === 'draft') {
                if (user_id === row.user_id && appLocation === 'my-trips') {
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
                    tripContainer.addEventListener('click', () => {
                        console.log(`Trip id '${row.trip_id}' clicked`);
                        viewTrip(row.trip_id);
                    })
                    tripContainer.id = `trip${row.trip_id}`;
                    resultsDiv.appendChild(tripContainer);
                }
            }
        });
        return tripArr;
}

const renderUsers = (data) => {
    const resultsDiv = document.getElementById('results');

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
        resultsDiv.appendChild(userContainer);
    });
}

const renderActivities = (data) => {
    const resultsDiv = document.getElementById('results');
    data.forEach(row => {
        let icon = ''
        switch (row.gm_type) {
            case 'Flight':
                icon = '<i class="fa-light fa-plane-departure"></i>'
                break;
            case 'Hotel':
                icon = '<i class="fa-light fa-hotel"></i>'
                break;
            case 'Business':
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
            // PLACE ACTIVITY LINK HERE
        })
        resultsDiv.appendChild(activityContainer);
    });
}