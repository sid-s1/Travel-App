import { layout, page, pageContainer, worldMap } from './layout.js';
import { HtmlElements } from './html-elements.js';
import { viewTrip } from './view-trip.js';
import { initAutocomplete } from './autocomplete.js';
import { dateExtractor } from './date-extractor.js';
import { generateForm } from './new-trip.js'

export const renderEditTripForm = (tripId) => {
    layout.reset();
    layout.editTrip();
    const user_id = localStorage.getItem('userId');
    pageContainer.name = tripId;

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
        worldMap.style.backgroundImage = `url("${dbRes.data[0].hero_image_url}")`

        axios.get(`/user/trips/activities/${tripId}`)
        .then(dbRes => {
            console.log(dbRes);

            dbRes.data.forEach(row => {
                const newDiv = document.createElement('div');
                console.log(`${row.gm_type} start date ${dateExtractor.htmlInputDate(row.activity_start_date)}`);
                const form = generateEditForm(row.gm_type, newDiv, row);
                pageContainer.insertBefore(form, pageContainer.lastChild);
            })

            // render options bar
            if (page.childElementCount <= 2) {
                renderOptionsBar();
            };

            console.log(`editing trip id: ${tripId}`);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

}

const initBlurEvent = (element, route) => {
    if (!route) return

    let requireSave = false;
    element.addEventListener('change', () => {
         requireSave = true;
    })
    return element.addEventListener('blur', (e) => {
        const data = {
            route: route,
            userInput: e.target.value,
            tripId: pageContainer.name
        }
        if (route === 'hero_image_url') {
            worldMap.style.backgroundImage = `url("${e.target.value}")`
            worldMap.style.minHeight = '300px'
        }
        if (requireSave) {
            return axios.patch(`user/trips/static`, data)
                .then(() => requireSave = false)
                .catch(err => err)
        }

    });
}

export const renderOptionsBar = () => {
    // data to render buttons for adding items to itinerary
    const data = [
        {
            type: 'airline',
            element: 'i',
            elementClass: 'fa-duotone fa-plane new-trip-icon',
            containerClass: 'new-trip-icon-box',
            includeFloat: true
        },
        {
            type: 'hotel',
            element: 'i',
            elementClass: 'fa-duotone fa-hotel new-trip-icon',
            containerClass: 'new-trip-icon-box',
            includeFloat: true
        },
        {
            type: 'activity',
            element: 'i',
            elementClass: 'fa-duotone fa-clipboard-list-check new-trip-icon',
            containerClass: 'new-trip-icon-box',
            includeFloat: true
        }
    ]

    const optionsBar = createContainer(data, 'new-trip-options')
    const saveTripButton = HtmlElements.createButton('button', 'Save changes', 'save-trip-button');
    saveTripButton.addEventListener('click', (e) => {
        e.preventDefault;
        console.log('save trip form');
    })
    optionsBar.appendChild(saveTripButton);
    pageContainer.appendChild(optionsBar);
}


// Use data to store elements inside a container
const createContainer = (data, parentClass) => {
    const arr = [];
    for (const i in data) {
        const { type, element, elementContent, elementClass, containerClass, includeFloat } = data[i];
        const newElement = document.createElement(element);
        if (type) newElement.classList.add(type);
        if (elementClass) newElement.className = elementClass;
        if (elementContent) newElement.textContent = elementContent;
        const wrappedElement = layout.wrap([newElement], containerClass);

        if (type === 'airline' || type === 'hotel' || type === 'activity') {
            if (includeFloat) createFloatingElement(wrappedElement, '+', 'new-trip-icon-float')
        };

        wrappedElement.addEventListener('click', () => {
            const form = generateForm(type, newElement);
            pageContainer.insertBefore(form, pageContainer.lastChild);
        })
        arr.push(wrappedElement);
    }
    return layout.wrap(arr, parentClass);
};

// create Floating element and attach it to the target element
// pass in 3 paramaters - element to attach to, what content you'd like to appear in the float, class to attach for styling
const createFloatingElement = (attachTo, content, floatClass) => {
    attachTo.classList.add('allow-float');
    const float = document.createElement('div');
    float.className = `float ${floatClass}`;
    float.textContent = content;
    attachTo.appendChild(float);
    return float
}

const generateEditForm = (dataType, icon, dataRow) => {
    // data to control which inputs get rendered
    const data =
    {
        type: dataType,
        formClass: 'new-trip-form',
        renderItem: [
            {
                name: dataType,
                placeholder: `Enter ${dataType} name...`,
                element: 'input',
                type: 'text',
                inputClass: (dataRow.id) ? 'edit-trip-input' : 'new-trip-input',
                required: true,
                value: dataRow.activity_name
            },
            {
                name: 'start-date',
                element: 'input',
                type: 'date',
                inputClass: (dataRow.id) ? 'edit-trip-input' : 'new-trip-input',
                required: true,
                value: dateExtractor.htmlInputDate(dataRow.activity_start_date)
            },
            {
                name: 'end-date',
                element: 'input',
                type: 'date',
                inputClass: (dataRow.id) ? 'edit-trip-input' : 'new-trip-input',
                required: true,
                value: dateExtractor.htmlInputDate(dataRow.activity_end_date)
            },
            {
                name: 'rating',
                placeholder: 'Enter rating between 0 - 5',
                element: 'input',
                type: 'number',
                inputClass: (dataRow.id) ? 'edit-trip-input' : 'new-trip-input',
                required: true,
                value: dataRow.activity_rating
            }
        ]
    }

    const form = document.createElement('form');
    form.className = `allow-float ${data.formClass}`;
    form.id = `itin-${dataRow.id}`;

    // Function scope variables
    const tripId = pageContainer.name;
    const itineraryType = data.type;
    let googleApiData = {}; // house data to send in axios call
    let isValidItem = false; // use to track if suitable to enter into DB

    const renderItem = data.renderItem;
    for (const i in renderItem) {
        const { element, type, placeholder, name, inputClass, required, value } = renderItem[i];
        if ((itineraryType !== 'airline' || name !== 'end-date') && (itineraryType !== 'activity' || name !== 'end-date')) {
            const newElement = document.createElement(element);
            if (type) newElement.type = type;
            if (placeholder) newElement.placeholder = placeholder;
            if (name) newElement.name = name;
            if (inputClass) newElement.className = `${inputClass} input-autocomplete`;
            if (required) newElement.required = true;
            if (value) newElement.value = value;

            const label = document.createElement('label');
            const labelContent = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

            label.for = `${labelContent} name:`;
            label.textContent = labelContent;
            label.className = 'new-trip-label';

            // airline autocomplete dropdown
            if (name === 'airline') {
                const airlineOptions = document.createElement('ul');
                let floatContainer;
                newElement.addEventListener('keyup', (e) => {
                    isValidItem = false;
                    airlineOptions.innerHTML = '';
                    const userInput = e.target.value.toLowerCase();
                    if (userInput === '') {
                        floatContainer.innerHTML = ''
                    } else {
                        if (floatContainer === undefined) {
                            floatContainer = createFloatingElement(wrappedElement, '', 'airline-autocomplete')
                        };
                        const suggested = airlines.filter(airline => airline.toLowerCase().includes(userInput))
                        if (suggested.length === 0) {
                            // no suggested items
                            const listItem = document.createElement('li')
                            listItem.textContent = 'No airline exists'
                            airlineOptions.appendChild(listItem);
                        } else {
                            // render suggested items (5 or less items)
                            for (let i = 0; i < 5 && i < suggested.length; i++) {
                                const listItem = document.createElement('li')
                                listItem.textContent = suggested[i];
                                listItem.addEventListener('click', () => {
                                    newElement.value = suggested[i];
                                    isValidItem = true;
                                    floatContainer.innerHTML = '';
                                })
                                airlineOptions.appendChild(listItem);
                            }
                        }
                        floatContainer.appendChild(airlineOptions)
                    }
                });
            } else if (name === 'hotel' || name === 'activity') {
                isValidItem = false;
                const autoComplete = initAutocomplete(newElement, name);
                autoComplete.addListener('place_changed', () => {
                    isValidItem = true;
                    let value = newElement.value;
                    value = value.replaceAll(' ', '%20');
                    value = value.replaceAll(',', '%2C');
                    axios.get(`/placeDetails/${value}`)
                        .then(response => {
                            googleApiData = {};
                            googleApiData = response.data.location;
                        })
                        .catch(err => console.log(err))
                });
                newElement.addEventListener('change', () => {
                    isValidItem = false;
                })
            }

            let row;
            let wrappedElement;
            if (name === 'airline') {
                wrappedElement = layout.wrap([newElement], 'form-row-airline');
                row = layout.wrap([label, wrappedElement], 'form-row');
            } else {
                row = layout.wrap([label, newElement], 'form-row');
            }
            form.appendChild(row);
        }
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'float new-trip-delete-button';
    deleteButton.addEventListener('click', () => {
        // Change button state to 'Confirm' before deleting
        // check if already saved and if so - remove from DB
        // need to return & store itinerary_items ID number
        let itinerary_item = true; // testing only
        if (itinerary_item) {
            console.log('itinerary id is present?');
            wrappedForm.remove();
        } else {
            console.log('no id - remove safely');
            wrappedForm.remove();
        }
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'float new-trip-save-button';

    form.appendChild(saveButton)
    form.appendChild(deleteButton)

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // error prevention - ensure user has entered a valid airline/hotel or activity
        if (!isValidItem) {
            const firstInput = form.childNodes[0].childNodes[1]
            firstInput.focus()
            firstInput.select()
            alert(`Please enter a valid ${itineraryType}`)
            return
        }

        const formData = new FormData(form)
        const data = {
        userId: localStorage.getItem('userId'),
        tripId: tripId,
        type: itineraryType,
        name: formData.get(itineraryType),
        startDate: formData.get('start-date'),
        endDate: formData.get('end-date'),
        rating: formData.get('rating')
        }

        const combineData = {
            ...data,
            ...googleApiData
        }

        axios.post('/user/trips', combineData)
            .then(dbRes => {
                console.log(`-*-*-*- ${dbRes.rows} -*-*-*-`)
            });
    })

    const gridIcon = layout.wrap([icon], 'new-trip-grid-icon');
    const wrappedForm = layout.wrap([gridIcon, form, deleteButton], 'new-trip-form-frame allow-float');
    return wrappedForm;
}
