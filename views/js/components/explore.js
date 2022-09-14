import { renderSearchBar } from "./search.js"
import { layout, page, pageContainer } from "./layout.js";


export const renderExploreSearch = () => {
    layout.reset();
    layout.exploreSearch();
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    const resultsBarExists = !!document.querySelector('.search-div');
    if (!resultsBarExists) {
        const searchBar = renderSearchBar();
        pageContainer.insertBefore(searchBar, resultsContainer);
    }
}
