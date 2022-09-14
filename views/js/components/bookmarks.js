import { layout, pageContainer } from "./layout.js"
import { renderResults } from "./search.js"

export const renderBookmarks = () => {
    axios.get('/user/session')
    .then(response => {
        const result = response.data.rows[0];
        const loggedInUserId = result.id;
        console.log(`userid: ${loggedInUserId}`);
        layout.bookmarks();
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'results';
        pageContainer.appendChild(resultsContainer);
        axios.get(`/user/bookmarks/${loggedInUserId}`)
            .then(response => {
                const results = renderResults(response, loggedInUserId, 'bookmarks');
                resultsContainer.appendChild(results);
        })
    })
}