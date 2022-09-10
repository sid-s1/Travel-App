import { layout, page, pageContainer} from './layout.js';

export const renderNewTrip = () => {
    // set view
    layout.reset();
    layout.newtrip();
    
    // render options bar
    if (page.childElementCount <= 2) {
        renderOptionsBar();        
        const header = document.createElement('h1');
        header.textContent = '- ADD NEW TRIP -'
        pageContainer.insertBefore(header, pageContainer.lastChild)
    }    

}

const renderOptionsBar = () => {
    const flightIcon = document.createElement('i');
    flightIcon.className = 'fa-duotone fa-plane new-trip-icon';
    const addFlight = layout.wrap([flightIcon], 'new-trip-icon-box');
    addFlight.addEventListener('click', () => {
        const flightForm = addForm('flight');
        pageContainer.insertBefore(flightForm, pageContainer.lastChild)
    });


    const hotelIcon = document.createElement('i');
    hotelIcon.className = 'fa-duotone fa-hotel new-trip-icon';
    const addHotel = layout.wrap([hotelIcon], 'new-trip-icon-box');
    addHotel.addEventListener('click', () => {
        const hotelForm = addForm('hotel');
        pageContainer.insertBefore(hotelForm, pageContainer.lastChild)
    })

    const activityIcon = document.createElement('i');
    activityIcon.className = 'fa-duotone fa-clipboard-list-check new-trip-icon';
    const addActivity = layout.wrap([activityIcon], 'new-trip-icon-box')
    addActivity.addEventListener('click', () => {
        const activityForm = addForm('activity');
        pageContainer.insertBefore(activityForm, pageContainer.lastChild)
    })

    const optionBar = layout.wrap([addFlight, addHotel, addActivity], 'new-trip-options');
    pageContainer.appendChild(optionBar);
}

const addForm = (type) => {
    const form = document.createElement('form'); 
    form.className = 'build-form'   
    form.textContent = `test to confirm form type: ${type}`

    return form;
}