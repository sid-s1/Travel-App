export const likeDislike = (likeBtn, dislikeBtn, photoContainer, coverPhoto) => {
    likeBtn.innerHTML = `
    <i class="fa-thin fa-thumbs-up like-dislike-icons"></i>
    `;
    likeBtn.id = 'like-btn';
    dislikeBtn.innerHTML = `
    <i class="fa-thin fa-thumbs-down like-dislike-icons"></i>
    `;
    dislikeBtn.id = 'dislike-btn';
    const buttonArray = [likeBtn, dislikeBtn];

    buttonArray.forEach(button => {
        button.addEventListener('click', () => {
            if (button.getAttribute('id') === 'like-btn') {
                button.innerHTML = `
                <i class="fa-solid fa-thumbs-up like-dislike-icons"></i>
                `;
                photoContainer.replaceChildren(button, coverPhoto, dislikeBtn);
            }
            else {
                button.innerHTML = `
                <i class="fa-solid fa-thumbs-down like-dislike-icons"></i>
                `;
                photoContainer.replaceChildren(likeBtn, coverPhoto, button);
            }
        });
    });

    // buttonArray.forEach((button) => {
    //     button.addEventListener('click', () => {
    //         // button.classList = (status.value === 'inactive') ? 'active' : 'inactive';\
    //         // if (button.getAttribute('id') === 'like-btn') {

    //         //     button.innerHTML = `
    //         //     <i class="fa-solid fa-thumbs-up like-dislike-icons"></i>
    //         //     `;
    //         //     console.log(button.firstElementChild.classList.contains('fa-solid'));
    //         //     photoContainer.replaceChildren(button, coverPhoto, dislikeBtn);
    //         // }
    //         // else {
    //         //     button.innerHTML = `
    //         //     <i class="fa-solid fa-thumbs-down like-dislike-icons"></i>
    //         //     `;
    //         //     photoContainer.replaceChildren(likeBtn, coverPhoto, button);
    //         // }

    //         if (button.firstElementChild.classList.contains('fa-solid')) {

    //             button.firstElementChild.classList.replace('fa-solid', 'fa-thin');
    //             if (button.parentElement.getAttribute('id') !== null) {
    //                 photoContainer.replaceChildren(button, coverPhoto, dislikeBtn);
    //             }
    //             else {
    //                 photoContainer.replaceChildren(likeBtn, coverPhoto, button);
    //             }

    //             console.log('solid');
    //         }
    //         else {
    //             button.firstElementChild.classList.replace('fa-thin', 'fa-solid');

    //             if (button.parentElement.getAttribute('id') !== null) {
    //                 console.log('lol');
    //                 photoContainer.replaceChildren(button, coverPhoto, dislikeBtn);
    //             }
    //             else {
    //                 photoContainer.replaceChildren(likeBtn, coverPhoto, button);
    //             }
    //             console.log('empty');
    //         }
    //     });
    // });
};