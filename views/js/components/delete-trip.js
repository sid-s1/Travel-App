export const deleteTripListener = (tripId) => {
    const deleteTripButton = document.getElementById('delete-trip');
    deleteTripButton.addEventListener('click', () => {
        axios.delete(`/modifyTrip/deleteTrip/${tripId}`)
            .then(response => console.log(response.data))
            .catch(err => console.log(err))
    });
};