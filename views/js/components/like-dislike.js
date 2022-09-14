export const likeDislike = (likeBtn, dislikeBtn, loggedInUserId, tripId) => {
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

    resetLikeAndDislike();
    likeBtn.id = 'like-btn';
    dislikeBtn.id = 'dislike-btn';
    const buttonArray = [likeBtn, dislikeBtn];

    let likeBtnClicked = false;
    let dislikeBtnClicked = false;

    // axios call to controller to get 'liked' column for userid and tripid combo
    // if exists, change to below
    // if does not exist, create post request

    const callApiToChangeLike = (currentState, originalState) => {
        if (!(currentState === originalState)) {
            console.log('comparing like states');
            data.liked = currentState;
            axios.post('/user/votes/changeLike', data)
                .then(response => console.log(response.data))
                .catch(err => console.log(err))
        }
    };

    axios.get(`/user/votes/${loggedInUserId}/${tripId}`)
        .then(response => {
            // result will be either {liked: true} or {liked: false} or {noRow: true}
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
                likeBtnClicked = false;
                originalLikeState = JSON.parse(JSON.stringify(data)).liked;
            }
            else {
                resetLikeAndDislike();
            }

            buttonArray.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.getAttribute('id') === 'like-btn') {
                        dislikeBtnClicked = false;

                        likeBtnClicked = (likeBtnClicked) ? false : true;

                        if (likeBtnClicked) {
                            callApiToChangeLike(true, originalLikeState);
                            // changedLiked = true;
                            switchToLike();
                        }
                        else {
                            callApiToChangeLike(false, originalLikeState);
                            // changedLiked = true;
                            resetLikeAndDislike();
                        }
                    }
                    else {
                        likeBtnClicked = false;

                        dislikeBtnClicked = (dislikeBtnClicked) ? false : true;

                        if (dislikeBtnClicked) {
                            callApiToChangeLike(false, originalLikeState);
                            // changedLiked = true;
                            switchToDislike();
                        }
                        else {
                            callApiToChangeLike(true, originalLikeState);
                            // changedLiked = true;
                            resetLikeAndDislike();
                        }
                    }
                });
            });



            if (!(data.liked === originalLikeState)) {
                console.log('comparing like states');
                axios.post('/user/liked/changeLike', data)
                    .then(response => console.log(response.data))
                    .catch(err => console.log(err))
            }

            // check if data.liked is null, it means that user hasnt liked this yet so create new row

        })
        .catch(err => console.log(err))
};