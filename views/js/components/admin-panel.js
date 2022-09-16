import { securityQuestions } from './signup.js';
import { userStats } from './user-stats.js';
import { modal } from './render-modal.js';
import { layout } from './layout.js';

export const renderAdminPanel = (loggedInUserId) => {
    layout.adminPanel();
    const pageContainer = document.getElementById('page-container');
    pageContainer.innerHTML = '';

    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';

    adminPanel.innerHTML = '<h2 id="admin-panel-header">Admin Panel</h2>';

    axios.get('/user/session/allUsers')
        .then(response => {
            const users = response.data;
            for (const user of users) {
                const userRow = document.createElement('div');
                userRow.classList.add('user-details-row');

                const emailField = document.createElement('input');
                emailField.value = user.email;
                emailField.classList.add('user-details');
                emailField.required = true;

                const securityQuestionField = document.createElement('select');
                securityQuestionField.classList.add('user-details');
                securityQuestionField.classList.add('security-qn-dropdown');
                securityQuestionField.required = true;

                for (const key in securityQuestions) {
                    const securityQuestionOption = document.createElement('option');
                    securityQuestionOption.text = securityQuestions[key];
                    securityQuestionOption.value = key;
                    if (key == user.security_qn) {
                        securityQuestionOption.setAttribute('selected', '');
                        securityQuestionField.setAttribute('value', key);
                    }
                    securityQuestionField.appendChild(securityQuestionOption);
                }

                const securityAnswerField = document.createElement('input');
                securityAnswerField.classList.add('user-details');
                securityAnswerField.placeholder = 'Enter new security answer';
                securityAnswerField.setAttribute('type', 'text');

                const usernameField = document.createElement('input');
                usernameField.value = user.username;
                usernameField.classList.add('user-details');
                usernameField.required = true;
                usernameField.setAttribute('type', 'text');

                const newPasswordField = document.createElement('input');
                newPasswordField.classList.add('user-details');
                newPasswordField.placeholder = 'Enter new password';
                newPasswordField.setAttribute('type', 'password');

                const adminStatusDiv = document.createElement('div');
                const adminStatusLabel = document.createElement('label');
                adminStatusLabel.textContent = 'Admin';
                adminStatusDiv.classList.add('admin-status-div');

                const adminInputTrue = document.createElement('input');
                adminInputTrue.setAttribute('type', 'radio');
                adminInputTrue.setAttribute('name', `admin-status-${user.id}`);

                adminStatusDiv.append(adminStatusLabel, adminInputTrue);

                const userStatusDiv = document.createElement('div');
                const userStatusLabel = document.createElement('label');
                userStatusLabel.textContent = 'User';
                userStatusDiv.classList.add('admin-status-div');

                const adminInputFalse = document.createElement('input');
                adminInputFalse.setAttribute('type', 'radio');
                adminInputFalse.setAttribute('name', `admin-status-${user.id}`);

                userStatusDiv.append(userStatusLabel, adminInputFalse);

                adminInputTrue.classList.add('user-admin-radio');
                adminInputFalse.classList.add('user-admin-radio');

                if (user.admin) adminInputTrue.checked = true;
                else adminInputFalse.checked = true;

                const userEditActionList = document.createElement('ul');
                userEditActionList.classList.add('user-edit-action-options');

                const updateUserDetails = document.createElement('li');
                updateUserDetails.textContent = 'Update';
                updateUserDetails.classList.add('user-edit-action-btn');

                updateUserDetails.addEventListener('click', () => {
                    let checkNewAdminStatus;
                    if (adminInputTrue.checked) {
                        checkNewAdminStatus = true;
                    }
                    else if (adminInputFalse.checked) {
                        checkNewAdminStatus = false;
                    }

                    let newSecurityAnswer;
                    if (securityAnswerField.value) {
                        newSecurityAnswer = securityAnswerField.value;
                    }

                    let newPassword;
                    if (newPasswordField.value) {
                        newPassword = newPasswordField.value;
                    }

                    const username = usernameField.value;
                    const email = emailField.value;
                    const securityQn = securityQuestionField.value;

                    const form = document.createElement('form');
                    form.innerHTML = `
                        <input name="id" value=${user.id}>
                        <input name="email" value="${email}">
                        <input name="username" value="${username}">
                        <input name="password" value="${newPassword}">
                        <input name="secQns" value="${securityQn}">
                        <input name="secAns" value="${newSecurityAnswer}">
                        <input name="admin" value=${checkNewAdminStatus}>
                        <input name="loggedIn" value=${loggedInUserId}>
                        `;

                    const formdata = new FormData(form);
                    const data = {
                        id: formdata.get('id'),
                        email: formdata.get('email'),
                        username: formdata.get('username'),
                        password: formdata.get('password'),
                        secQns: formdata.get('secQns'),
                        secAns: formdata.get('secAns'),
                        admin: formdata.get('admin'),
                        loggedInUserId: formdata.get('loggedIn')
                    };

                    console.log(data);

                    const checkChange = (data.email !== user.email) || (data.username !== user.username) || (securityQn !== String(user.security_qn)) || (user.admin !== checkNewAdminStatus) || (newPasswordField.value.length > 0) || (securityAnswerField.value.length > 0);

                    if (checkChange === 1 || checkChange === true) {
                        axios.put('/user/session/updateUser', data)
                            .then(response => {
                                console.log('axios call');
                                const emailForm = {
                                    email: email
                                };
                                console.log(`checking form id - ${data.id} and logged in user id - ${loggedInUserId}`)
                                if (data.id == loggedInUserId) {
                                    if (data.username !== localStorage.getItem('username')) {
                                        localStorage.setItem('username', username);
                                        console.log(username);
                                        userStats.updateUsernameDisplay(username);
                                    }
                                    axios.put('/user/session/updateSessionEmail', emailForm)
                                        .then()
                                        .catch()
                                }
                                const modalElement = modal.create(response.data.message);
                                modal.display(modalElement, loggedInUserId);
                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        const message = `You have not updated anything, ${localStorage.getItem('username')}!`
                        const modalElement = modal.create(message);
                        modal.display(modalElement, loggedInUserId);
                    }

                });

                const deleteUser = document.createElement('li');
                deleteUser.textContent = 'Delete';
                deleteUser.classList.add('user-edit-action-btn');

                deleteUser.addEventListener('click', (e) => {
                    const userId = user.id;

                    if (e.target.textContent == 'Delete') {
                        if (userId === loggedInUserId) {
                            const message = 'You cannot delete yourself!';
                            const modalElement = modal.create(message);
                            modal.display(modalElement, loggedInUserId);
                        }
                        else {
                            e.target.textContent = 'Confirm';
                            e.target.classList.add('confirm-delete-user');
                            setTimeout(() => {
                                e.target.textContent = 'Delete';
                                e.target.classList.remove('confirm-delete-user');
                            }, 3000)
                        }
                    }
                    else {
                        axios.delete(`/user/session/${userId}/${user.username}`)
                            .then(response => {
                                const modalElement = modal.create(response.data.message);
                                modal.display(modalElement, loggedInUserId);
                                renderAdminPanel(loggedInUserId);
                                console.log(response.data);
                            })
                            .catch(err => console.log(err))
                    }
                });

                userEditActionList.append(updateUserDetails, deleteUser);

                userRow.append(emailField, usernameField, newPasswordField, securityQuestionField, securityAnswerField, adminStatusDiv, userStatusDiv, userEditActionList);
                adminPanel.appendChild(userRow);
            }
            pageContainer.appendChild(adminPanel);

        })
        .catch(err => console.log(err))
};