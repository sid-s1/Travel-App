import { layout, page, pageContainer} from './layout.js';

export const renderNewTrip = () => {
    // set view
    layout.reset();
    layout.newtrip();
    
    // render options bar
    if (page.childElementCount <= 2) {
        renderOptionsBar();
    }    

}

const renderOptionsBar = () => {
    const flightIcon = document.createElement('i');
    flightIcon.className = 'fa-duotone fa-plane new-trip-icon';
    const addFlight = layout.wrap([flightIcon], 'new-trip-icon-box')

    const hotelIcon = document.createElement('i');
    hotelIcon.className = 'fa-duotone fa-hotel new-trip-icon'
    const addHotel = layout.wrap([hotelIcon], 'new-trip-icon-box')

    const activityIcon = document.createElement('i');
    activityIcon.className = 'fa-duotone fa-clipboard-list-check new-trip-icon';
    const addActivity = layout.wrap([activityIcon], 'new-trip-icon-box')

    const optionBar = layout.wrap([addFlight, addHotel, addActivity], 'new-trip-options');
    pageContainer.appendChild(optionBar);
}