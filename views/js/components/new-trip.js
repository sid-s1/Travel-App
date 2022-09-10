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
            if (type === 'airline' || type === 'hotel' || type === 'activity') {
                const deleteButton = createFloatingElement(form, 'X', 'new-trip-icon-float float-delete');
                 deleteButton.addEventListener('click', () => {
                    const formInput = deleteButton.previousSibling;
                    if (formInput.id) {
                        console.log('itinerary id is present?')
                        // (?) Note to self: once the form blur adds to DB, attach itinerary id to form?
                        // As we'll then need to do a call to remove from itinerary_items if form deleted.
                    } else {
                        console.log('no id - remove safely')
                        form.remove();
                    }
                    console.log('all inputs removed');                    
                });
            };
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
                    inputName: dataType,
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    inputName: 'date',
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
                    inputName: dataType,
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    inputName: 'start-date',
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    inputName: 'end-date',
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
                    inputName: dataType,
                    inputClass: 'new-trip-input',
                    required: true
                },
                {
                    element: 'input',
                    type: 'date',                    
                    inputName: 'start-date',
                    inputClass: 'new-trip-input',
                    required: true
                }
            ]
        }
    ]

    const form = document.createElement('form'); 
    
    const fetchData = data.filter(item => item.type === dataType)[0];
    form.className = fetchData.formClass;  
    const items = fetchData.items;   

    for (const i in items) {
        const { element, type, placeholder, inputName, inputClass, required } = items[i];
        const newElement = document.createElement(element);
        if (type) newElement.type = type;
        if (placeholder) newElement.placeholder = placeholder;
        if (inputName) newElement.name = inputName;
        if (inputClass) newElement.className = inputClass;
        if (required) newElement.required = true;

        newElement.addEventListener('change', () => {
            console.log('change detected');
            newElement.addEventListener('blur', (event) => {
                event.preventDefault();
                console.log('blur detected')
                axios.get('/user/session')
                    .then(dbRes => {
                        const { id, username } = dbRes.data.rows[0];
                        console.log(`logged in users id: ${id}`)
                        console.log(`logged in users username: ${username}`)
                        // (?) Note to self: troubleshoot with the guys thoughts on determining if a trip_id already exists?
                    })
                    .catch((err) => {
                        if (err.response.status === 500) {
                            alert('Something went wrong. Please try again.');
                        } else {
                            alert('save me jeebus')
                        }
                    });
            newElement.removeEventListener('blur', () => {});
           });
        });
            
        form.appendChild(newElement)
    }
    
    const wrapForm = layout.wrap([icon, form], 'new-trip-form-frame')
    return wrapForm;
}