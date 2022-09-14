export const countLikesDislikes = (tripId) => {
    axios.get(`/user/votes/countVotes/${tripId}`)
        .then(response => console.log(response))
        .catch(err => console.log(err))
};