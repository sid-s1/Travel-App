import { layout } from "./layout.js"

export const renderProfile = (userId) => {
    // Set view
    layout.profile();
    
    // Render side panel
    const sidePanel = document.getElementById('side-panel');
    const sidePanelOptions = document.createElement('ul');
    sidePanelOptions.className = 'side-panel-list';
    
    const home = document.createElement('li');
    home.textContent = 'Home';
    home.className = 'side-panel-options';    
    home.classList.add('side-panel-focus');
    home.addEventListener('click', () => {
        // Render home
        changeSidePanelFocus(home)
    })
    sidePanelOptions.appendChild(home);

    const trips = document.createElement('li');
    trips.textContent = 'Your Trips';
    trips.className = 'side-panel-options';  
    trips.addEventListener('click', () => {
        // Render page-container to display existing trips
        changeSidePanelFocus(trips)
    })  
    sidePanelOptions.appendChild(trips);

    const bookmarks = document.createElement('li');
    bookmarks.textContent = 'Your Bookmarks';
    bookmarks.className = 'side-panel-options'; 
    bookmarks.addEventListener('click', () => {
        // Render page-container to display existing bookmarks
        changeSidePanelFocus(bookmarks)
    })   
    sidePanelOptions.appendChild(bookmarks);

    const explore = document.createElement('li');
    explore.textContent = 'Explore';
    explore.className = 'side-panel-options';
    explore.addEventListener('click', () => {
        // Render explore 
        changeSidePanelFocus(explore)
    })    
    sidePanelOptions.appendChild(explore);

    const addNewTrip = document.createElement('li');
    addNewTrip.textContent = '+ Add New Trip';
    addNewTrip.className = 'side-panel-options';    
    addNewTrip.addEventListener('click', () => {
        // Render page-container to add new trip
        changeSidePanelFocus(addNewTrip)
    })
    sidePanelOptions.appendChild(addNewTrip);

    sidePanel.appendChild(sidePanelOptions);
}

// Change background of focus tab being viewed
const changeSidePanelFocus = (focus) => {
    const sidePanelOptions = document.getElementsByClassName('side-panel-options');
    for (const panel of sidePanelOptions) {
        if (panel !== focus) {
            panel.classList.remove('side-panel-focus');
        } else {
            panel.classList.add('side-panel-focus');
        }
    }     
}