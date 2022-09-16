import { layout, page, pageContainer, worldMap } from './layout.js';
import { airlines } from './airlines.js';
import { initAutocomplete } from './autocomplete.js';
import { dateExtractor } from './date-extractor.js';

export const renderNewTrip = (tripId=null) => {
    // set view
    layout.reset();
    layout.newtrip();

    // create new trip row in db and return trip id
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

        // render static fields
        const staticFields = [
            {
                element: 'h1',
                textContent: (tripId) ? `HI ${username.toUpperCase()}! LET'S EDIT THAT TRIP!` : `HI ${username.toUpperCase()}! LET'S BUILD THAT TRIP!`
            },
            {
                name: 'trip_name',
                element: 'input',
                placeholder: '- Click to enter Trip Title -',
                maxLength: '50',
                className: 'new-trip-title'
            },
            {
                name: 'hero_image_url',
                element: 'input',
                placeholder: '- Click to add Image URL -',
                className: 'new-trip-url'
            },
            {
                name: 'description',
                element: 'textarea',
                placeholder: 'Enter details about your trip here...',
                maxLength: '1200',
                className: 'new-trip-description'
            },
            {
                name: 'key_takeaway',
                element: 'input',
                placeholder: '- Click to add a Trip Quote or Top Tip -',
                maxLength: '50',
                className: 'new-trip-takeaway'
            }
        ]

    if (!tripId) {
    axios.put(`user/trips/${userId}`)
        .then(dbRes => {
            const tripId = dbRes.data.rows[0].id;
            console.log(tripId)
            pageContainer.name = tripId;
        }).catch(err => err)


    for (const item of staticFields) {
        const { name, element, textContent, placeholder, maxLength, className } = item;
        const newElement = document.createElement(element);
        if (name) newElement.name = name;
        if (textContent) newElement.textContent = textContent;
        if (placeholder) newElement.placeholder = placeholder;
        if (maxLength) newElement.maxLength = maxLength;
        if (className) newElement.className = className;
        initBlurEvent(newElement, name)
        pageContainer.appendChild(newElement)
    }
        // render options bar for new trip
        if (page.childElementCount <= 2) {
            renderOptionsBar();
        };
    } else {
    // set pageContainer
    pageContainer.name = tripId;

    // get trip data & set input fields with trip values
    axios.get(`/user/trips/${tripId}`)
    .then(dbRes => {
        console.log(dbRes);

        staticFields[1].value = dbRes.data[0].trip_name;
        staticFields[2].value = dbRes.data[0].hero_image_url;
        staticFields[3].value = dbRes.data[0].description;
        staticFields[4].value = dbRes.data[0].key_takeaway;

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
            dbRes.data.forEach(row => {
                const newDiv = document.createElement('div');
                const form = generateForm(row.gm_type, newDiv, row);
                pageContainer.insertBefore(form, pageContainer.lastChild);
            })
        })
        .catch(err => console.log(err));
        // render options bar for edit trip
        if (page.childElementCount <= 2) {
            renderOptionsBar();
        };

        })
    }
}



// attach Blur event listener to automatically update db
export const initBlurEvent = (element, route) => {
    if (!route) return
    let requireSave = false;
    element.addEventListener('change', () => {
         requireSave = true;
    })
    element.addEventListener('click', (e) => {
        e.target.select();
    })
    return element.addEventListener('blur', (e) => {
        const userInput = e.target.value
        const data = {
            route: route,
            userInput: userInput,
            tripId: pageContainer.name
        }
        if (route === 'hero_image_url') {
            if (checkURL(userInput)) {
                worldMap.style.backgroundImage = `url("${userInput}")`
                worldMap.style.minHeight = '300px'
            } else {
                e.target.value = 'invalid URL'
            }
        }
        if (route === 'key_takeaway') {
            const addQuotes = userInput.replaceAll('"', '')
            e.target.value = `"${addQuotes}"`
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
        },
        {
            type: 'post',
            element: 'button',
            elementContent: 'POST TRIP',
            elementClass: 'post-trip',
            ContainerClass: 'new-trip-icon-box',
        }
    ]

    const optionsBar = createContainer(data, 'new-trip-options')
    pageContainer.appendChild(optionsBar);
}

// Use data to store elements inside a container
const createContainer = (data, parentClass) => {
    const arr = [];
    console.log(data)
    for (const i in data) {
        const { type, element, elementContent, elementClass, containerClass, includeFloat } = data[i];
        const newElement = document.createElement(element);
        if (type) newElement.classList.add(type);
        if (elementClass) newElement.className = elementClass;
        if (elementContent) newElement.textContent = elementContent;
        const wrappedElement = layout.wrap([newElement], containerClass);

        if (type === 'airline' || type === 'hotel' || type === 'activity') {
            if (includeFloat) createFloatingElement(wrappedElement, '+', 'new-trip-icon-float')
            // event listener to buttons to generate relevant form
            wrappedElement.addEventListener('click', () => {
            const form = generateForm(type, newElement);
            pageContainer.insertBefore(form, pageContainer.lastChild);
            })
        } else if (type === 'post') {
            // event lisenter for post trip button

            wrappedElement.addEventListener('click', () => {
                const tripId = pageContainer.name;
                axios.get(`user/trips/status/${tripId}`)
                    .then(() => console.log('trip POSTED'))
                    .catch(() => console.log('Trip could not be posted'))
            })
        }

        arr.push(wrappedElement);
    }
    return layout.wrap(arr, parentClass);
};

// create Floating element and attach it to the target element
// pass in 3 paramaters - element to attach to, what content you'd like to appear in the float, class to attach for styling
export const createFloatingElement = (attachTo, content, floatClass) => {
    attachTo.classList.add('allow-float');
    const float = document.createElement('div');
    float.className = `float ${floatClass}`;
    float.innerHTML = content;
    attachTo.appendChild(float);
    return float
}

export const checkURL = (url) => {
    try {
        new URL(url);
    }
    catch(e) {
      return false;
    }
    return true;
}

export const generateForm = (dataType, icon, activityRow=null) => {
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
                inputClass: 'new-trip-input',
                required: true
            },
            {
                name: 'start-date',
                element: 'input',
                type: 'date',
                inputClass: 'new-trip-input',
                required: true
            },
            {
                name: 'end-date',
                element: 'input',
                type: 'date',
                inputClass: 'new-trip-input',
                required: true
            },
            {
                name: 'rating',
                placeholder: 'Enter rating between 0 - 5',
                element: 'input',
                type: 'number',
                inputClass: 'new-trip-input',
                required: true
            }
        ]
    }

    const form = document.createElement('form');
    form.className = `allow-float ${data.formClass}`;

    // Function scope variables
    const tripId = pageContainer.name;
    const itineraryType = data.type;
    let googleApiData = {}; // house data to send in axios call
    let isValidItem = false; // use to track if suitable to enter into DB

    const renderItem = data.renderItem;

    if (activityRow) {
        renderItem[0].value = activityRow.activity_name;
        if (renderItem[0].name === 'airline' || renderItem[0].name === 'activity' || renderItem[0].name === 'hotel') {
            renderItem[0].element = 'p'
            renderItem[0].textContent = activityRow.activity_name;
        }
        renderItem[1].value = dateExtractor.htmlInputDate(activityRow.activity_start_date);
        renderItem[2].value = dateExtractor.htmlInputDate(activityRow.activity_end_date);
        renderItem[3].value = activityRow.activity_rating;
    }

    for (const i in renderItem) {
        const { element, type, placeholder, name, inputClass, required, value, textContent } = renderItem[i];
        if ((itineraryType !== 'airline' || name !== 'end-date') && (itineraryType !== 'activity' || name !== 'end-date')) {
            const newElement = document.createElement(element);
            if (type) newElement.type = type;
            if (placeholder) newElement.placeholder = placeholder;
            if (name) newElement.name = name;
            if (inputClass) newElement.className = `${inputClass} input-autocomplete`;
            if (required) newElement.required = true;
            if (value) newElement.value = value;
            if (textContent) newElement.textContent = textContent;

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
                            if (!googleApiData.city) {
                                googleApiData.city = 'notFound';
                            }
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
    deleteButton.className = 'float new-trip-delete-button';
    deleteButton.innerText = 'Delete'
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', (e) => {
        if (activityRow) {
            wrappedForm.id = activityRow.id;
        }
        if (e.target.textContent == 'Delete') {
            e.target.textContent = 'Confirm'
            e.target.classList.add('confirm')
            setTimeout(() => {
                e.target.textContent = 'Delete'
                e.target.classList.remove('confirm')
            }, 3000)
        } else {
            if (!wrappedForm.id) {
                wrappedForm.remove();
            } else {
                axios.delete(`/user/trips/${wrappedForm.id}`)
                    .then(() => {
                        wrappedForm.remove();
                    }).catch(() => alert('Itinerary Item cannot be deleted'))
            }

        }
    })

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'float new-trip-save-button hidden';

    form.appendChild(saveButton)
    form.appendChild(deleteButton)

    form.addEventListener('change', () => {
        saveButton.classList.replace('hidden', 'visible')
        saveButton.classList.remove('saved')
        saveButton.textContent = 'Save'
        saveButton.disabled = false;
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form)
        const data = {
        tripId: tripId,
        type: itineraryType,
        name: formData.get(itineraryType),
        startDate: formData.get('start-date'),
        endDate: formData.get('end-date'),
        rating: formData.get('rating')
        }

        console.log(data);

        const combinedData = {
            ...data,
            ...googleApiData
        }

        if (activityRow) {
            wrappedForm.id = activityRow.id;
            axios.patch(`/user/trips/activity/${activityRow.id}`, data)
            .then(dbRes => {
                console.log(dbRes);
                saveButton.classList.toggle('saved')
                saveButton.textContent = 'Saved'
                saveButton.disabled = true;
            })
        } else {
        // error prevention - ensure user has entered a valid airline/hotel or activity
        if (!isValidItem) {
            const firstInput = form.childNodes[0].childNodes[1]
            firstInput.focus()
            firstInput.select()
            alert(`Please enter a valid ${itineraryType}`)
            return
        }

        axios.post('/user/trips', combinedData)
            .then(dbRes => {
                const itineraryId = dbRes.data.itineraryId;
                wrappedForm.id = itineraryId;
                saveButton.classList.toggle('saved')
                saveButton.textContent = 'Saved'
                saveButton.disabled = true;
            });
        }
    })

    const gridIcon = layout.wrap([icon], 'new-trip-grid-icon');
    const wrappedForm = layout.wrap([gridIcon, form, deleteButton], 'new-trip-form-frame allow-float');
    return wrappedForm;
}
