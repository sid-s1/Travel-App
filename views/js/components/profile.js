import { layout, sidePanel, worldMap } from "./layout.js";
import { renderNewTrip } from './new-trip.js';
import { userStats } from "./user-stats.js";
import { renderExploreSearch } from "./explore.js"

export const renderProfile = (userId) => {
    // Set view
    layout.reset();
    layout.profile();

    // Render badges
    // -- insert function --

    // Render world map
    worldMap.innerHTML = '';
    const profileDiv = document.createElement('div');
    profileDiv.textContent = 'Profile Pic';
    const profilePic = layout.wrap([profileDiv], 'profile-pic', 'id');
    worldMap.appendChild(profilePic);

    // get user ID and display stats if it is the same as the user who's profile is being displayed
    axios.get('/user/session')
        .then(response => {
            const result = response.data.rows[0];
            const loggedInUserId = result.id;
            const statsDiv = document.createElement('div');

            statsDiv.innerHTML = `
                     <div>Number of trips: <span id="total-trips"></span></div>
                    <div>Number of countries: <span id="total-countries"></span></div>
                    <div>Achievements: <span id="total-achievements"></span></div>
                    `;
            const profileStats = layout.wrap([statsDiv], 'profile-stats', 'id')

            userStats(loggedInUserId);
            worldMap.appendChild(profileStats);
        })

    // Render side panel
    const sidePanelOptions = document.createElement('ul');
    sidePanelOptions.className = 'side-panel-list';

    // Home framew
    const home = document.createElement('li');
    home.textContent = 'Home';
    const homeIcon = document.createElement('img');
    homeIcon.src = '../../assets/home_icon.png';
    homeIcon.className = 'side-panel-icon';
    const homeFrame = layout.wrap([homeIcon, home], 'side-panel-options');

    homeFrame.addEventListener('click', () => {
        renderProfile(userId);
    })
    sidePanelOptions.appendChild(homeFrame);

    // My Trips frame
    const trips = document.createElement('li');
    trips.textContent = 'My Trips';
    const tripsIcon = document.createElement('img');
    tripsIcon.src = '../../assets/trips_icon.png';
    tripsIcon.className = 'side-panel-icon';
    const tripFrame = layout.wrap([tripsIcon, trips], 'side-panel-options');
    tripFrame.addEventListener('click', (e) => {
        // Render page-container to display existing trips
        // -- insert function --
        console.log(e.target)
        changeSidePanelFocus(tripFrame);
    });
    sidePanelOptions.appendChild(tripFrame);

    // Bookmarks frame
    const bookmarks = document.createElement('li');
    bookmarks.textContent = 'Bookmarks';
    const bookmarksIcon = document.createElement('img');
    bookmarksIcon.src = '../../assets/bookmarks_icon.png';
    bookmarksIcon.className = 'side-panel-icon';
    const bookmarkFrame = layout.wrap([bookmarksIcon, bookmarks], 'side-panel-options');
    bookmarkFrame.addEventListener('click', (e) => {
        // Render page-container to display existing bookmarks
        // -- insert function --
        console.log(e)
        changeSidePanelFocus(bookmarkFrame);
    })
    sidePanelOptions.appendChild(bookmarkFrame);

    // Explore frame
    const explore = document.createElement('li');
    explore.textContent = 'Explore';
    const exploreIcon = document.createElement('img');
    exploreIcon.src = '../../assets/explore_icon.png'
    exploreIcon.className = 'side-panel-icon';
    const exploreFrame = layout.wrap([exploreIcon, explore], 'side-panel-options');
    exploreFrame.addEventListener('click', () => {
        // Render explore
        changeSidePanelFocus(exploreFrame);
        renderExploreSearch();
    })
    sidePanelOptions.appendChild(exploreFrame);

    // Add Trip frame
    const addTrip = document.createElement('li');
    addTrip.textContent = '+ Add Trip';
    const addTripIcon = document.createElement('img');
    addTripIcon.src = '../../assets/newtrip_icon.png';
    addTripIcon.className = 'side-panel-icon';
    const addTripFrame = layout.wrap([addTripIcon, addTrip], 'side-panel-options');
    addTripFrame.addEventListener('click', () => {
        // Render page-container to add new trip
        // -- insert function --
        changeSidePanelFocus(addTripFrame);
        renderNewTrip();
    })
    sidePanelOptions.appendChild(addTripFrame);

    sidePanel.appendChild(sidePanelOptions);
    changeSidePanelFocus(homeFrame);
}

// Change background of focus tab being viewed
const changeSidePanelFocus = (focus) => {
    const sidePanelOptions = document.getElementsByClassName('side-panel-options');
    for (const panel of sidePanelOptions) {
        if (panel !== focus) {
            panel.classList.remove('side-panel-focus');
        } else {
            panel.classList.add('side-panel-focus');
        };
    };
};