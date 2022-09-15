import { layout, page, pageContainer } from './layout.js';
import { HtmlElements } from './html-elements.js';
import { viewTrip } from './view-trip.js';

export const renderEditTripForm = (tripId) => {
    layout.reset();
    layout.editTrip();
    const user_id = localStorage.getItem('userId');
    axios.get(`/user/trips/${tripId}`)
    .then(dbRes => {
        console.log(dbRes);

        const tripEditForm = document.createElement('form');
        tripEditForm.id = 'trip-edit-form'

        const tripNameInput = HtmlElements.createInput('text', 'trip-name', 'trip-name', 'edit-trip-input', dbRes.data[0].trip_name);
        const tripTypeInput = HtmlElements.createInput('text', 'trip_type', 'trip_type', 'edit-trip-input', dbRes.data[0].trip_type);
        const tripStartDateInput = HtmlElements.createInput('date', 'trip_start_date', 'trip_start_date', 'edit-trip-input', dbRes.data[0].trip_start_date);
        const tripEndDateInput = HtmlElements.createInput('date', 'trip_end_date', 'trip_end_date', 'edit-trip-input', dbRes.data[0].trip_end_date);
        const tripHeroImageUrlInput = HtmlElements.createInput('text', 'hero_image_url', 'hero_image_url', 'edit-trip-input', dbRes.data[0].hero_image_url);
        const tripDescriptionInput = HtmlElements.createInput('text', 'description', 'description', 'edit-trip-input', dbRes.data[0].description);
        const tripKeyTakeawayInput = HtmlElements.createInput('text', 'key_takeaway', 'key_takeaway', 'edit-trip-input', dbRes.data[0].key_takeaway);

        const tripNameLabel = HtmlElements.createLabel('trip-name', 'Trip name', 'edit-trip-label');
        const tripTypeLabel = HtmlElements.createLabel('trip-type', 'Trip type', 'edit-trip-label');
        const tripStartDateLabel = HtmlElements.createLabel('trip_start_date', 'Trip start date', 'edit-trip-label');
        const tripEndDateLabel = HtmlElements.createLabel('trip_end_date', 'Trip end date', 'edit-trip-label');
        const tripHeroImageUrlLabel = HtmlElements.createLabel('hero_image_url', 'Trip image url', 'edit-trip-label');
        const tripDescriptionLabel = HtmlElements.createLabel('description', 'Trip description', 'edit-trip-label');
        const tripKeyTakeawayLabel = HtmlElements.createLabel('key_takeaway', 'Key takeaway', 'edit-trip-label');

        const saveButton = HtmlElements.createButton('submit', 'Save', null, 'edit-form-button');

        const cancelButton = HtmlElements.createButton('button', 'Cancel', null, 'edit-form-button');
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            viewTrip(tripId);
        })
        tripEditForm.append(tripNameLabel, tripNameInput, tripTypeLabel, tripTypeInput, tripStartDateLabel, tripStartDateInput, tripEndDateLabel, tripEndDateInput, tripHeroImageUrlLabel, tripHeroImageUrlInput, tripDescriptionLabel, tripDescriptionInput, tripKeyTakeawayLabel, tripKeyTakeawayInput, cancelButton, saveButton);

        tripEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(tripEditForm);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                confirmedPassword: formData.get('confirm-password'),
                securityQuestion: formData.get('security-question'),
                securityAnswer: formData.get('security-answer')
            }
        });
        pageContainer.appendChild(tripEditForm);

    })
    .catch(err => console.log(err));

    console.log(`editing trip id: ${tripId}`);
}