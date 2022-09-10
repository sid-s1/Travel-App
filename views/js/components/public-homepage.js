import { layout, worldMap, page, pageContainer } from "./layout.js";

export const renderPublicHomepage = () => {
    layout.publicHomepage();



    const searchBar =  document.createElement('input');
    searchBar.setAttribute("placeholder", "Search for trips...");
    searchBar.id = "homepage-search-bar";
    searchBar.name = "homepage-search-bar";
    const searchButton = document.createElement('span');
    searchButton.innerHTML = '<i class="fa-regular fa-magnifying-glass"></i>'
    searchButton.addEventListener('click', () => {
        console.log(searchBar.value);

    });
    searchButton.style.cursor = 'pointer';

    const searchDiv = layout.wrap([searchBar,searchButton], 'search-div');
    searchDiv.style.display = 'flex';
    searchDiv.style.justifyContent = 'space-between';
    searchDiv.style.columnGap = '20px';

    worldMap.appendChild(searchDiv);
}