import { layout, pageContainer } from "./layout.js"
import { renderTrips } from "./search.js"

export const renderMyTrips = () => {
    layout.myTrips();
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    resultsContainer.innerHTML = 'test';

}