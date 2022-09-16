export const userStats = {
    display: (userId) => {
        axios.get(`/user/stats/tripNumber/${userId}`)
            .then(response => {
                let result = 0;
                const totalTrips = document.getElementById('total-trips');
                totalTrips.textContent = 0;
                if (response.data.length) {
                    result = response.data[0];
                    totalTrips.textContent = result.trip_count;
                }
            })
            .catch(err => console.log(err))
        axios.get(`/user/stats/countryNumber/${userId}`)
            .then(response => {
                let result = 0;
                const totalCountries = document.getElementById('total-countries');
                totalCountries.textContent = 0;
                if (response.data.length) {
                    result = response.data[0];
                    totalCountries.textContent = result.country_count;
                }
            })
            .catch(err => console.log(err))
        axios.get(`/user/stats/achievementNumber/${userId}`)
            .then(response => {
                let result = 0;
                const totalAchievements = document.getElementById('total-achievements');
                totalAchievements.textContent = 0;
                if (response.data.length) {
                    result = response.data[0];
                    totalAchievements.textContent = result.achievement_count;
                }
            })
            .catch(err => console.log(err))
    },
    updateUsernameDisplay: (username) => {
        const statsUsername = document.querySelector('#stats-username');
        statsUsername.innerHTML = `<h1>${username}'s Stats</h1>`;
    }
};