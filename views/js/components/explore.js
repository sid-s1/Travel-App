import { renderSearch } from "./search.js"
import { layout, pageContainer } from "./layout.js";


export const renderExploreSearch = () => {
    layout.reset();
    layout.exploreSearch();
    const exploreContainer = document.createElement('div');
    exploreContainer.id = 'explore-container'
    pageContainer.appendChild(exploreContainer);
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    renderSearch(exploreContainer);
}
