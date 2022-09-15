import { layout, page, pageContainer } from './layout.js';
import { HtmlElements } from './html-elements.js';
import { viewTrip } from './view-trip.js';
import { renderOptionsBar, initBlurEvent } from './new-trip.js'

export const renderEditTripForm = (tripId) => {
    layout.reset();
    layout.editTrip();
    const user_id = localStorage.getItem('userId');

    axios.get(`/user/trips/${tripId}`)
    .then(dbRes => {
        console.log(dbRes);

        const staticFields = [
            {
                element: 'h1',
                textContent: '- EDIT TRIP -'
            },
            {
                name: 'trip_name',
                element: 'input',
                placeholder: 'Enter trip title',
                maxLength: '100',
                value: dbRes.data[0].trip_name
            },
            {
                name: 'hero_image_url',
                element: 'input',
                placeholder: 'Enter image url',
                value: dbRes.data[0].hero_image_url
            },
            {
                name: 'description',
                element: 'textarea',
                placeholder: 'Tell us about your trip / experiences / free-text-field',
                maxLength: '1500',
                className: 'new-trip-description',
                value: dbRes.data[0].description
            },
            {
                name: 'key_takeaway',
                element: 'input',
                placeholder: 'Your key takeaway from the trip',
                maxLength: '50',
                value: dbRes.data[0].key_takeaway
            }
        ]

        for (const item of staticFields) {
            const { name, element, textContent, placeholder, maxLength, className, value } = item;
            const newElement = document.createElement(element);
            if (name) newElement.name = name;
            if (textContent) newElement.textContent = textContent;
            if (placeholder) newElement.placeholder = placeholder;
            if (maxLength) newElement.maxLength = maxLength;
            if (className) newElement.className = className;
            if (value) newElement.value = value;
            initBlurEvent(newElement, name)
            pageContainer.appendChild(newElement)
        }

        // render options bar
        if (page.childElementCount <= 2) {
            renderOptionsBar();
        };

        console.log(`editing trip id: ${tripId}`);
    })
    .catch(err => console.log(err));

}