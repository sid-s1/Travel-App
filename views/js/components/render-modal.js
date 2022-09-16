import { renderAdminPanel } from "./admin-panel.js";
import { renderLogin } from "./login.js";

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
    display: (modal, loggedInUserId = null) => {
        const modalDiv = modal.firstElementChild;
        modalDiv.classList.add('show-modal');
        document.body.appendChild(modal);

        const closeModal = document.getElementById('close-modal');
        closeModal.addEventListener('click', () => {
            modalDiv.classList.remove('show-modal');
            setTimeout(() => {
                modal.remove();
            }, 350);
            if (loggedInUserId) {
                renderAdminPanel(loggedInUserId);
            }
        });

        const loginAction = document.getElementById('login-action-modal');
        if (loginAction) {
            loginAction.addEventListener('click', () => {
                modalDiv.classList.remove('show-modal');
                setTimeout(() => {
                    modal.remove();
                    renderLogin();
                }, 350);
            });
        }
    },
    createForLogin: () => {
        const modal = document.createElement('div');
        modal.id = 'modal-container';
        modal.innerHTML = `
        <div class="modal">
            <div class="modal-box">
                <div class="modal-content">
                    <h2>
                        Please login to perform that action
                    </h2>
                    <div id="modal-action-container">
                        <p id="login-action-modal" class="multi-btn-modal">Login</p>
                        <p id="close-modal" class="multi-btn-modal">Close</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        return modal;
    }
};