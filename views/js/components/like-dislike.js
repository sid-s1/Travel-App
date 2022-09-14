import { countVotes } from './view-trip.js';

export const likeDislikeAction = (likeBtn, dislikeBtn, loggedInUserId, tripId) => {
    const resetLikeAndDislike = () => {
        likeBtn.innerHTML = `
                <i class="fa-thin fa-thumbs-up like-dislike-icons"></i>
                `;
        dislikeBtn.innerHTML = `
                <i class="fa-thin fa-thumbs-down like-dislike-icons"></i>
                `;
    };

    const switchToLike = () => {
        likeBtn.innerHTML = `
                <i class="fa-solid fa-thumbs-up like-dislike-icons"></i>
                `;
        dislikeBtn.innerHTML = `
                <i class="fa-thin fa-thumbs-down like-dislike-icons"></i>
                `;
    };

    const switchToDislike = () => {
        dislikeBtn.innerHTML = `
                <i class="fa-solid fa-thumbs-down like-dislike-icons"></i>
                `;
        likeBtn.innerHTML = `
                <i class="fa-thin fa-thumbs-up like-dislike-icons"></i>
                `;
    };

    const updateVoteCountOnPress = () => {
        const likeCount = document.getElementById('like-count');
        const dislikeCount = document.getElementById('dislike-count');
        countVotes(tripId)
            .then(voteCount => {
                likeCount.textContent = `+ ${voteCount.likes}`;
                dislikeCount.textContent = `- ${voteCount.dislikes}`;
            })
    };

    const form = document.createElement('form');
    form.innerHTML = `
    <input type="hidden" name="liked">
    `;
    const formData = new FormData(form);
    const data = {
        liked: formData.get('liked'),
        userId: loggedInUserId,
        tripId: tripId
    };
    let originalLikeState;

    likeBtn.id = 'like-btn';
    dislikeBtn.id = 'dislike-btn';
    const buttonArray = [likeBtn, dislikeBtn];

    let likeBtnClicked = false;
    let dislikeBtnClicked = false;

    const callApiToChangeLike = (currentState, originalState) => {
        if (!(currentState === originalState)) {
            data.liked = currentState;
            return axios.post('/user/votes/changeLikeStatus', data)
                .then(response => response)
                .catch(err => err)
        }
    };

    const likeDislikeListeners = () => {
        buttonArray.forEach(button => {
            button.addEventListener('click', () => {
                if (button.getAttribute('id') === 'like-btn') {
                    dislikeBtnClicked = false;

                    likeBtnClicked = (likeBtnClicked === true) ? false : true;

                    if (likeBtnClicked) {
                        callApiToChangeLike(true, originalLikeState)
                            .then(() => {
                                originalLikeState = true;
                                updateVoteCountOnPress();
                                switchToLike();
                            })
                    }
                    else {
                        callApiToChangeLike(null, originalLikeState)
                            .then(() => {
                                originalLikeState = null;
                                updateVoteCountOnPress();
                                resetLikeAndDislike();
                            })
                    }
                }
                else {
                    likeBtnClicked = false;

                    dislikeBtnClicked = (dislikeBtnClicked === true) ? false : true;

                    if (dislikeBtnClicked) {
                        callApiToChangeLike(false, originalLikeState)
                            .then(() => {
                                originalLikeState = false;
                                updateVoteCountOnPress();
                                switchToDislike();
                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        callApiToChangeLike(null, originalLikeState)
                            .then(() => {
                                originalLikeState = null;
                                updateVoteCountOnPress();
                                resetLikeAndDislike();
                            })
                            .catch(err => console.log(err))

                    }
                }
            });
        });
    };

    axios.get(`/user/votes/${loggedInUserId}/${tripId}`)
        .then(response => {
            let result = response.data;
            if (result.liked === true) {
                switchToLike();
                data.liked = true;
                likeBtnClicked = true;
                originalLikeState = JSON.parse(JSON.stringify(data)).liked;
            }
            else if (result.liked === false) {
                switchToDislike();
                data.liked = false;
                dislikeBtnClicked = true;
                originalLikeState = JSON.parse(JSON.stringify(data)).liked;
            }
            else {
                resetLikeAndDislike();
            }
            likeDislikeListeners();
        })
        .catch(err => {
            console.log(err);
        })
};