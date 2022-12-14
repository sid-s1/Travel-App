import { layout, page, pageContainer, sidePanel, worldMap } from "./layout.js";
import { renderNewTrip } from './new-trip.js';
import { userStats } from "./user-stats.js";
import { renderExploreSearch } from "./explore.js";
import { renderMyTrips } from "./my-trips.js";
import { renderBookmarks } from "./bookmarks.js";

export const renderProfile = (targetUserId) => {
    // Set view
    layout.reset();
    layout.profile();
    worldMap.innerHTML = '';
    worldMap.style.backgroundImage = `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1')`;
    page.style.backgroundImage = 'none';
    pageContainer.style.border = 'none';

    // Render badges
    // -- insert function --  

    // get user ID and display stats if it is the same as the user who's profile is being displayed
    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');

    // Populate user stats
    const statsDiv = document.createElement('div');
    statsDiv.innerHTML = `
    <div id="stats-username"><h1>${username}'s Stats</h1></div>
    <div>Trips: <span id="total-trips"></span></div>
    <div>Countries: <span id="total-countries"></span></div>
    <div>Activities: <span id="total-activities"></span></div>
    <div>Likes on my trips: <span id="total-likes"></span></div>
    `;

    if (!userId) {
        // if not logged in, create session data
        axios.get('/user/session')
            .then(response => {
                const result = response.data.rows[0];
                username = result.username;
                userId = result.id;
                localStorage.setItem('userId', userId) //store in local for future reference
                localStorage.setItem('username', username)
                userStats.updateUsernameDisplay(username);
            })
    }

    const profileStats = layout.wrap([statsDiv], 'profile-stats', 'id');
    // userStats.updateUsername(targetUserId);
    userStats.display(targetUserId);
    worldMap.appendChild(profileStats);

    // Render side panel
    const sidePanelOptions = document.createElement('ul');
    sidePanelOptions.className = 'side-panel-list';

    // Page container
    const insertHTML = `
    <h1><b>Welcome to TRIPT</b></h1>
    <h3 style='color: cadetblue'>Here's a couple of things that you can do while you're here...</h3>
    <p><b style='color: blue'>Add Trip</b> - upload your favourite trip and tell the world about your experience!</p>
    <p>View <b style='color: blue'>My Trips</b> - can't remember all the fine details? No worries! Your trip will remain a DRAFT until you're ready to POST it.</p>
    <p><b style='color: blue'>Bookmark</b> your favourite trips, or itineraries that you want to come back to later.</p>
    <p>If you're looking for inspiration, why not <b style='color: blue'>Explore</b> trips posted by other users. Vote for your favourites!</p>
    <img height='400px' src='https://media0.giphy.com/media/dYUslDahf6Uw71gH3t/giphy.gif?cid=6c09b9528636fab61a49d6f32c118ff05f1360c5e2f4001e&rid=giphy.gif&ct=s'>
    `
    pageContainer.innerHTML = insertHTML

    // Home frame
    const home = document.createElement('li');
    home.textContent = 'Home';
    home.className = 'side-panel-list-item';
    const homeIcon = document.createElement('img');
    homeIcon.src = '../../assets/home_icon.png';
    homeIcon.className = 'side-panel-icon';
    const homeFrame = layout.wrap([homeIcon, home], 'side-panel-options');

    homeFrame.addEventListener('click', () => {
        renderProfile(targetUserId);
    })
    sidePanelOptions.appendChild(homeFrame);

    // My Trips frame
    const trips = document.createElement('li');
    trips.textContent = 'My Trips';
    trips.className = 'side-panel-list-item';
    const tripsIcon = document.createElement('img');
    tripsIcon.src = '../../assets/trips_icon.png';
    tripsIcon.className = 'side-panel-icon';
    const tripFrame = layout.wrap([tripsIcon, trips], 'side-panel-options');
    tripFrame.addEventListener('click', (e) => {
        // Render page-container to display existing trips
        renderMyTrips();
        changeSidePanelFocus(tripFrame);
        userStats.display(userId);
    });
    sidePanelOptions.appendChild(tripFrame);

    // Bookmarks frame
    const bookmarks = document.createElement('li');
    bookmarks.textContent = 'Bookmarks';
    bookmarks.className = 'side-panel-list-item';
    const bookmarksIcon = document.createElement('img');
    bookmarksIcon.src = '../../assets/bookmarks_icon.png';
    bookmarksIcon.className = 'side-panel-icon';
    const bookmarkFrame = layout.wrap([bookmarksIcon, bookmarks], 'side-panel-options');
    bookmarkFrame.addEventListener('click', (e) => {
        // Render page-container to display existing bookmarks
        renderBookmarks();
        changeSidePanelFocus(bookmarkFrame);
        userStats.display(userId);
    })
    sidePanelOptions.appendChild(bookmarkFrame);

    // Explore frame
    const explore = document.createElement('li');
    explore.textContent = 'Explore';
    explore.className = 'side-panel-list-item';
    const exploreIcon = document.createElement('img');
    exploreIcon.src = '../../assets/explore_icon.png'
    exploreIcon.className = 'side-panel-icon';
    const exploreFrame = layout.wrap([exploreIcon, explore], 'side-panel-options');
    exploreFrame.addEventListener('click', () => {
        // Render explore
        changeSidePanelFocus(exploreFrame);
        renderExploreSearch();
        userStats.display(userId);
    })
    sidePanelOptions.appendChild(exploreFrame);

    // Add Trip frame
    const addTrip = document.createElement('li');
    addTrip.textContent = '+ Add Trip';
    addTrip.className = 'side-panel-list-item';
    const addTripIcon = document.createElement('img');
    addTripIcon.src = '../../assets/newtrip_icon.png';
    addTripIcon.className = 'side-panel-icon';
    const addTripFrame = layout.wrap([addTripIcon, addTrip], 'side-panel-options');
    let clicked = false;
    addTripFrame.addEventListener('click', () => {
        changeSidePanelFocus(addTripFrame);
        renderNewTrip();
    })
    sidePanelOptions.appendChild(addTripFrame);

    sidePanel.appendChild(sidePanelOptions);
    changeSidePanelFocus(homeFrame);
};

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