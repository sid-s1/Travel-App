import { modal } from "./render-modal.js";

export const showcaseLikeDislikeAction = (showcaseLikeButton, showcasedisikeButton) => {
    showcaseLikeButton.addEventListener('click', () => {
        const likeDislikePublicModal = modal.createForLogin();
        modal.display(likeDislikePublicModal);
    });
    showcasedisikeButton.addEventListener('click', () => {
        const likeDislikePublicModal = modal.createForLogin();
        modal.display(likeDislikePublicModal);
    });
};