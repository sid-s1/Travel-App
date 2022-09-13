import { layout, page, pageContainer} from './layout.js';
import { airlines } from './airlines.js';

export const renderNewTrip = () => {
    // set view
    layout.reset();
    layout.newtrip();
    
    // render options bar
    if (page.childElementCount <= 2) {            
        const header = document.createElement('h1');
        header.textContent = '- ADD NEW TRIP -'
        pageContainer.appendChild(header)
        renderOptionsBar();    
    };

    // get user id, then create a new trip row in db, returning tripId value
    axios.get('/user/session') 
        .then(dbRes => {
            const userId = dbRes.data.rows[0].id;
        // create new trip row in db and return trip id 
        axios.put(`user/trips/${userId}`)
            .then(dbRes => {
                const tripId = dbRes.data.rows[0].id;
                pageContainer.name = tripId;
                console.log(`pageContainer.name = ${tripId}`)
            }).catch(err => err)
    }).catch(err => err)
}

const renderOptionsBar = () => {
    // options buttons to control adding of items to itinerary
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
    pageContainer.appendChild(optionsBar);
}

// Use data to store elements inside a container
const createContainer = (data, parentClass) => {
    const arr = [];
    for (const i in data) {
        const { type, element, elementContent, elementClass, containerClass, includeFloat } = data[i];
        const newElement = document.createElement(element);
        if (type) newElement.classList.add(type);
        if (elementClass) newElement.className =  elementClass;
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

const generateForm = (dataType, icon) => {
    const data = [
        {
            type: 'airline',
            formClass: 'new-trip-form',
            items: [
                {
                    element: 'input',
                    type: 'text',                    
                    placeholder: `Enter ${dataType} name...`,
                    name: 'airline',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    name: 'start-date',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'number',
                    placeholder: 'Enter rating between 0 - 10',
                    name: 'rating',
                    inputClass: 'new-trip-input',
                    required: true
                }
            ]
        },
        {
            type: 'hotel',
            formClass: 'new-trip-form',
            items: [
                {
                    element: 'input',
                    type: 'text',                    
                    placeholder: `Enter ${dataType} name...`,
                    name: 'hotel',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    name: 'start-date',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',
                    name: 'end-date',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'number',
                    placeholder: 'Enter rating between 0 - 10',
                    name: 'rating',
                    inputClass: 'new-trip-input',
                    required: true
                }
            ]
        },
        {
            type: 'activity',
            formClass: 'new-trip-form',
            items: [
                {
                    element: 'input',
                    type: 'text',                    
                    placeholder: `Enter ${dataType} name...`,
                    name: 'activity',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    name: 'start-date',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'number',
                    placeholder: 'Enter rating between 0 - 10',
                    name: 'rating',
                    inputClass: 'new-trip-input',
                    required: true
                }
            ]
        }
    ]

    const tripId = pageContainer.name;
    const form = document.createElement('form');     
    const fetchData = data.filter(item => item.type === dataType)[0];
    const itineraryType = fetchData.type;
    const name = fetchData.name;
    form.className = fetchData.formClass;

    const items = fetchData.items;
    for (const i in items) {
        const { element, type, placeholder, name, inputClass, required } = items[i];
        const newElement = document.createElement(element);
        if (type) newElement.type = type;
        if (placeholder) newElement.placeholder = placeholder;
        if (name) newElement.name = name;
        if (inputClass) newElement.className = inputClass;
        if (required) newElement.required = true;

        if (itineraryType === 'airline') {
            // @SID - Please work on the autocomplete referencing airlines.js array
            newElement.addEventListener('keyup', (e) => {
                const userInput = e.target.value.toLowerCase();
                console.log(userInput);
                let test = airlines.filter(element => airlines.includes(element));
            })
        }
             

        // axios.put(`/user/trips/${tripId}`, data)
        // .then(() => {
        //         console.log('added to DB')
        //         // visual green tick, or in/out color affect on the input?
        //         setTimeout(renderChallenges, 2000);
        //     } 
        // )
        // .catch(err => {
        //     if (err.response.status === 500) {
        //         alert('An unknown error occured. Please try again')
        //     } else {
        //         alert(err.response.data.message)
        //     }
        // });

        form.appendChild(newElement)
    }

        


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (tripId) {
            console.log('itinerary id is present?')
        } else {
            console.log('no id - remove safely')
            form.remove();
        }
        console.log('all inputs removed');                    
    });

    // const saveButton = createFloatingElement(form, 'Save', 'new-trip-save-form')
    const saveButton = document.createElement('button')
    saveButton.textContent = 'Save';
    saveButton.onclick = 'this.parentNode.submit()';
    saveButton.addEventListener('click', () => {
        const formData = new FormData(form)
        const data = {
            tripId: tripId,
            type: itineraryType,
            name: formData.get(itineraryType),
            startDate: formData.get('start-date'),
            endDate: formData.get('end-date'),
            rating: formData.get('rating')
        };
        console.log(data)
    })

    const gridButtons = layout.wrap([deleteButton, saveButton], 'new-trip-buttons')
    form.appendChild(gridButtons)
    const gridIcon = layout.wrap([icon], 'new-trip-grid-icon');    
    return layout.wrap([gridIcon, form], 'new-trip-form-frame')
}
