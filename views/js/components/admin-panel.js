export const renderAdminPanel = () => {
    const pageContainer = document.getElementById('page-container');
    pageContainer.innerHTML = '';

    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';

    const adminPanelHeader = document.createElement('div');
    adminPanelHeader.id = 'admin-panel-header';

    const headerContents = [
        'Email Address', 'Username', 'New Password', 'Security Question', 'Security Answer', 'Admin Privelege'
    ];

    for (let i = 0; i < 6; i++) {
        const adminPanelHeaderItem = document.createElement('p');
        adminPanelHeaderItem.classList.add('admin-panel-items');
        adminPanelHeaderItem.textContent = headerContents[i];
        adminPanelHeader.appendChild(adminPanelHeaderItem);
    }

    adminPanel.appendChild(adminPanelHeader);

    axios.get('/user/session/allUsers')
        .then(response => {

            let p = new Promise((resolve, reject) => {
                const users = response.data;
                for (const user of users) {
                    const userRow = document.createElement('div');
                    userRow.classList.add('user-details-row');

                    const emailField = document.createElement('input');
                    emailField.value = user.email;
                    emailField.classList.add('user-details');

                    const securityQuestionField = document.createElement('input');
                    securityQuestionField.value = user.security_qn;
                    securityQuestionField.classList.add('user-details');

                    const securityAnswerField = document.createElement('input');
                    securityAnswerField.value = user.security_ans;
                    securityAnswerField.classList.add('user-details');

                    const usernameField = document.createElement('input');
                    usernameField.value = user.username;
                    usernameField.classList.add('user-details');

                    const newPasswordField = document.createElement('input');
                    newPasswordField.classList.add('user-details');
                    newPasswordField.placeholder = 'Enter new password';

                    const adminInputTrue = document.createElement('input');
                    adminInputTrue.setAttribute('type', 'radio');
                    const adminInputFalse = document.createElement('input');
                    adminInputFalse.setAttribute('type', 'radio');

                    adminInputTrue.classList.add('user-details');
                    adminInputFalse.classList.add('user-details');

                    if (user.admin) adminInputTrue.checked = true;
                    else adminInputFalse.checked = true;

                    const updateUserDetails = document.createElement('button');
                    updateUserDetails.textContent = 'Update';

                    updateUserDetails.addEventListener('click', () => {
                        const checkNewAdminStatus = (adminInputTrue) ? adminInputTrue : adminInputFalse;

                        const form = document.createElement('form');
                        form.innerHTML = `
                        <input name="id" value=${user.id}
                        <input name="email" value=${emailField.value}
                        <input name="username" value=${usernameField.value}
                        <input name="password" value=${newPasswordField.value}
                        <input name="secQns" value=${securityQuestionField.value}
                        <input name="secAns" value=${securityAnswerField.value}
                        <input name="admin" value=${checkNewAdminStatus}
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

                    const deleteUser = document.createElement('button');
                    deleteUser.textContent = 'Delete';

                    userRow.append(emailField, usernameField, newPasswordField, securityQuestionField, securityAnswerField, adminInputTrue, adminInputFalse, updateUserDetails, deleteUser);
                    adminPanel.appendChild(userRow);
                }
                pageContainer.appendChild(adminPanel);
            });

            p.then(() => {

            });

        })
        .catch(err => console.log(err))
};