export const userStats = (userId) => {
    axios.get(`/userStats/tripNumber/${userId}`)
        .then(response => {
            const result = response.data[0];
            const totalTrips = document.getElementById('total-trips');
            totalTrips.textContent = result.trip_count;
        })
        .catch()
    axios.get(`/userStats/countryNumber/${userId}`)
        .then(response => {
            const result = response.data[0];
            const totalCountries = document.getElementById('total-countries');
            totalCountries.textContent = result.country_count;
        })
        .catch()
    axios.get(`/userStats/achievementNumber/${userId}`)
        .then(response => {
            const result = response.data[0];
            const totalAchievements = document.getElementById('total-achievements');
            totalAchievements.textContent = result.achievement_count;
        })
        .catch()
};