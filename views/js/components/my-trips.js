import { layout, pageContainer } from "./layout.js"
import { renderTrips, executeSearch } from "./search.js"

export const renderMyTrips = () => {
    axios.get('/user/session')
        .then(response => {
            const result = response.data.rows[0];
            const loggedInUserId = result.id;

            layout.myTrips();
            const resultsContainer = document.createElement('div');
            resultsContainer.id = 'results';
            const form = document.createElement('form');
            const userIdInput = document.createElement('input');
            userIdInput.type = 'hidden';
            userIdInput.name = 'search-bar';
            userIdInput.id = 'search-bar';
            userIdInput.value = loggedInUserId;
            const searchType = document.createElement('input');
            searchType.type = 'hidden';
            searchType.name = 'search-type'
            searchType.value = 'my-trips'
            form.appendChild(userIdInput);
            form.appendChild(searchType);
            pageContainer.appendChild(resultsContainer);
            resultsContainer.innerHTML = 'test';
            executeSearch(form);
    })
}