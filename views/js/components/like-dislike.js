export const likeDislike = (likeBtn, dislikeBtn, loggedInUserId, tripId) => {
    likeBtn.innerHTML = `
    <i class="fa-thin fa-thumbs-up like-dislike-icons"></i>
    `;
    likeBtn.id = 'like-btn';
    dislikeBtn.innerHTML = `
    <i class="fa-thin fa-thumbs-down like-dislike-icons"></i>
    `;
    dislikeBtn.id = 'dislike-btn';
    const buttonArray = [likeBtn, dislikeBtn];

    let likeBtnClicked = false;
    let dislikeBtnClicked = false;

    // axios call to controller to get 'liked' column for userid and tripid combo
    // if exists, change to below
    // if does not exist, create post request

    axios.get(`/user/votes/${loggedInUserId}/${tripId}`)
        .then(response => {
            // result will be either {liked: true} or {liked: false} or {noRow: true}
            let result = response.data;
            buttonArray.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.getAttribute('id') === 'like-btn') {
                        likeBtnClicked = true;
                        dislikeBtnClicked = false;
                        switchToLike();
                        // photoContainer.replaceChildren(button, coverPhoto, dislikeBtn);
                    }
                    else {
                        dislikeBtnClicked = true;
                        likeBtnClicked = false;
                        switchToDislike();
                        // photoContainer.replaceChildren(likeBtn, coverPhoto, button);
                    }
                });
            });

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

        })
        .catch(err => console.log(err))
};