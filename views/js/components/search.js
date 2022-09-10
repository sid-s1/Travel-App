import { layout, worldMap, page, pageContainer } from "./layout.js";
import { renderProfile } from "./profile.js"

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

    const searchByCountryLabel = document.createElement('label');
    searchByCountryLabel.setAttribute('for', 'country');
    searchByCountryLabel.textContent = 'Country';

    const searchByCountry = document.createElement('input');
    searchByCountry.type = 'radio';
    searchByCountry.name = 'search-type';
    searchByCountry.id = 'country';
    searchByCountry.value = 'country';
    searchByCountry.checked = false;

    const searchTabs = layout.wrap([searchByAll, searchByAllLabel, searchByUser, searchByUserLabel, searchByCity, searchByCityLabel, searchByCountry, searchByCountryLabel],'search-tabs')

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
        console.log(dbRes.data);
        renderSearchResults(dbRes.data);
    })
    .catch((err) => {
        console.log(err);
    })
}

const renderSearchResults = (data) => {
    const searchType = document.querySelector('input[name="search-type"]:checked').value;
    pageContainer.innerHTML = '';
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results'
    if (searchType === 'user') {
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
    } else if (searchType === 'city') {
        resultsContainer.innerHTML = 'city';
    } else if (searchType === 'country') {
        resultsContainer.innerHTML = 'country';
    } else if (searchType === 'all') {
        resultsContainer.innerHTML = 'all';
    }
    pageContainer.appendChild(resultsContainer);

}