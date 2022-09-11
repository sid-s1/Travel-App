import { layout, worldMap, page, pageContainer } from "./layout.js";
import { renderProfile } from "./profile.js"
import { dateExtractor } from "./dateExtractor.js"

export const renderSearch = () => {

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


    worldMap.appendChild(searchDiv);
}


const executeSearch = (form) => {
    const formData = new FormData(form);
    const data = {
        searchString: formData.get('homepage-search-bar'),
        searchType: formData.get('search-type')
      };
    axios.post('/search', data)
    .then((dbRes) => {
        renderSearchResults(dbRes.data);
    })
    .catch((err) => {
        console.log(err);
    })
}

const renderTrips = (data) => {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results'

    console.log(data);

    const tripArr = []
    for (let i=0; i < data.length; i++) {
        const idCheck = (trip) => trip.trip_id === data[i].id;
        if (!tripArr.some(idCheck)) {
            const obj = {
                trip_id: data[i].id,
                trip_name: data[i].trip_name,
                trip_descr: data[i].description,
                trip_status: data[i].trip_status,
                trip_start_date: data[i].trip_start_date,
                trip_end_date: data[i].trip_end_date,
            }
        tripArr.push(obj);
        }
    }

    for (let i=0; i < data.length; i++) {
        const trip = tripArr.find(item => item.trip_id === data[i].id);
        if (trip.trip_cities) {
            trip.trip_cities.push(data[i].city_name)
        } else {
            trip.trip_cities = [data[i].city_name]
        }
    }

    for (let i=0; i < data.length; i++) {
        const trip = tripArr.find(item => item.trip_id === data[i].id);
        if (trip.trip_countries) {
            if (trip.trip_countries != data[i].country_name) {
                trip.trip_countries.push(data[i].country_name)
            }
        } else {
            trip.trip_countries = [data[i].country_name]
        }
    }

        console.log(tripArr);
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
                })
                tripContainer.id = `trip${row.trip_id}`;
                resultsContainer.appendChild(tripContainer);
            }
        });
        return resultsContainer;
}

const renderUsers = (data) => {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results'
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
            renderProfile(`${row.user_id}`);
        })
        resultsContainer.appendChild(userContainer);
    });
    return resultsContainer;
}

const renderActivities = (data) => {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results'
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
        })
        resultsContainer.appendChild(activityContainer);
    });
    return resultsContainer;
}

const renderSearchResults = (data) => {
    const searchType = document.querySelector('input[name="search-type"]:checked').value;
    pageContainer.innerHTML = '';
    if (searchType === 'user') {
        pageContainer.appendChild(renderUsers(data));
    } else if (searchType === 'city') {
        pageContainer.appendChild(renderTrips(data));
    } else if (searchType === 'country') {
        pageContainer.appendChild(renderTrips(data));
    } else if (searchType === 'activity') {
        console.log(data);
        pageContainer.appendChild(renderActivities(data));
    } else if (searchType === 'all') {
        console.log(data);
        pageContainer.appendChild(renderUsers(data.users));
        pageContainer.appendChild(renderTrips(data.trips));
        pageContainer.appendChild(renderActivities(data.activites));
    }
}