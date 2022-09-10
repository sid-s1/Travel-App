import { layout } from "./layout.js"

export const renderProfile = (userId) => {
    // Set view
    layout.reset();
    layout.profile();
    
    // Render stats
    // -- insert function --
    
    // Render badges
    // -- insert function --

    // Render side panel
    const sidePanel = document.getElementById('side-panel');
    const sidePanelOptions = document.createElement('ul');
    sidePanelOptions.className = 'side-panel-list';
    
    const home = document.createElement('li');
    home.textContent = 'Home'; 
    home.addEventListener('click', () => {
        // Render home
        // -- insert function --
        changeSidePanelFocus(home)
    })
    const homeIcon = document.createElement('img');
    homeIcon.src = '../../assets/home_icon.png';
    homeIcon.className = 'side-panel-icon';
    let wrapper = layout.wrap([homeIcon, home], 'side-panel-options');
    sidePanelOptions.appendChild(wrapper);

    const trips = document.createElement('li');
    trips.textContent = 'My Trips';
    trips.addEventListener('click', () => {
        // Render page-container to display existing trips
        // -- insert function --
        changeSidePanelFocus(trips);
    })  
    const tripsIcon = document.createElement('img');
    tripsIcon.src = '../../assets/trips_icon.png';
    tripsIcon.className = 'side-panel-icon';
    wrapper = layout.wrap([tripsIcon, trips], 'side-panel-options');
    sidePanelOptions.appendChild(wrapper);

    const bookmarks = document.createElement('li');
    bookmarks.textContent = 'Bookmarks';
    bookmarks.addEventListener('click', () => {
        // Render page-container to display existing bookmarks
        // -- insert function --
        changeSidePanelFocus(bookmarks);
    })
    const bookmarksIcon = document.createElement('img');
    bookmarksIcon.src = '../../assets/bookmarks_icon.png';
    bookmarksIcon.className = 'side-panel-icon';
    wrapper = layout.wrap([bookmarksIcon, bookmarks], 'side-panel-options');
    sidePanelOptions.appendChild(wrapper);

    const explore = document.createElement('li');
    explore.textContent = 'Explore';
    explore.addEventListener('click', () => {
        // Render explore 
        // -- insert function --
        changeSidePanelFocus(explore);
    })    
    const exploreIcon = document.createElement('img');
    exploreIcon.src = '../../assets/explore_icon.png'
    exploreIcon.className = 'side-panel-icon';
    wrapper = layout.wrap([exploreIcon, explore], 'side-panel-options');
    sidePanelOptions.appendChild(wrapper);

    const addTrip = document.createElement('li');
    addTrip.textContent = '+ Add Trip'; 
    addTrip.addEventListener('click', () => {
        // Render page-container to add new trip
        // -- insert function --
        changeSidePanelFocus(addTrip);
    })
    const addTripIcon = document.createElement('img');
    addTripIcon.src = '../../assets/newtrip_icon.png';
    addTripIcon.className = 'side-panel-icon';
    wrapper = layout.wrap([addTripIcon, addTrip], 'side-panel-options');
    sidePanelOptions.appendChild(wrapper);

    sidePanel.appendChild(sidePanelOptions);
    changeSidePanelFocus(home);
}

// Change background of focus tab being viewed
const changeSidePanelFocus = (focus) => {
    const sidePanelOptions = document.getElementsByClassName('side-panel-options');
    for (const panel of sidePanelOptions) {
        if (panel !== focus.parentElement) {              
            panel.classList.remove('side-panel-focus');    
        } else {
            panel.classList.add('side-panel-focus');
        }
    }     
}