import { renderAdminPanel } from "./admin-panel.js";

export const modal = {
    create: (message) => {
        const modal = document.createElement('div');
        modal.id = 'modal-container';
        modal.innerHTML = `
        <div class="modal">
            <div class="modal-box">
                <div class="modal-content">
                    <h2>
                        ${message}
                    </h2>
                    <p id="close-modal">Close</p>
                </div>
            </div>
        </div>
        `;
        return modal;
    },
    display: (modal, loggedInUserId) => {
        const modalDiv = modal.firstElementChild;
        modalDiv.classList.add('show-modal');
        document.body.appendChild(modal);

        const closeModal = document.getElementById('close-modal');
        closeModal.addEventListener('click', () => {
            modalDiv.classList.remove('show-modal');
            setTimeout(() => {
                modal.remove();
            }, 350);
            renderAdminPanel(loggedInUserId);
        });
    }
};