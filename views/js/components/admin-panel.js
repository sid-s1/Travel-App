export const renderAdminPanel = () => {
    const pageContainer = document.getElementById('page-container');
    pageContainer.innerHTML = '';

    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';

    adminPanel.innerHTML = '<p id="admin-panel-header">Admin Panel</p>';

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

                const securityQuestionField = document.createElement('input');
                securityQuestionField.value = user.security_qn;
                securityQuestionField.classList.add('user-details');
                securityQuestionField.required = true;
                securityQuestionField.setAttribute('type', 'text');

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

                const adminInputTrue = document.createElement('input');
                adminInputTrue.setAttribute('type', 'radio');
                adminInputTrue.setAttribute('name', `admin-status-${user.id}`);
                const adminInputFalse = document.createElement('input');
                adminInputFalse.setAttribute('type', 'radio');
                adminInputFalse.setAttribute('name', `admin-status-${user.id}`);

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
                        `;

                    const formdata = new FormData(form);
                    const data = {
                        id: formdata.get('id'),
                        email: formdata.get('email'),
                        username: formdata.get('username'),
                        password: formdata.get('password'),
                        secQns: formdata.get('secQns'),
                        secAns: formdata.get('secAns'),
                        admin: formdata.get('admin')
                    };

                    axios.put('/user/session/updateUser', data)
                        .then(response => console.log(response.data))
                        .catch(err => console.log(err))
                });

                const deleteUser = document.createElement('li');
                deleteUser.textContent = 'Delete';
                deleteUser.classList.add('user-edit-action-btn');

                userEditActionList.append(updateUserDetails, deleteUser);

                userRow.append(emailField, usernameField, newPasswordField, securityQuestionField, securityAnswerField, adminInputTrue, adminInputFalse, userEditActionList);
                adminPanel.appendChild(userRow);
            }
            pageContainer.appendChild(adminPanel);

        })
        .catch(err => console.log(err))
};