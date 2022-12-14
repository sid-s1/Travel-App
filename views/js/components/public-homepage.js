import { renderSearchBar } from "./search.js"
import { layout, pageContainer, worldMap } from "./layout.js";


export const renderPublicHomepage = () => {
    layout.reset();
    layout.publicHomepage();
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    if (resultsContainer.textContent.length < 1) {
        pageContainer.style.display = 'none';
    }
    const searchBar = renderSearchBar();
    worldMap.appendChild(searchBar);
}
