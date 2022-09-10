import { layout, pageContainer } from './layout.js';
import { renderNavBar } from './nav-bar-top.js';
import { renderProfile } from './profile.js';

export const renderLogin = () => {
    // set view
    layout.reset();
    layout.login();

    const form = createLoginForm()
    const wrapped = layout.wrap([form], 'form-container');
    pageContainer.appendChild(wrapped);
}
 
const createLoginForm = () => {
    const form = document.createElement('form'); 
    form.className = 'login-form'   

    const heading = document.createElement('h2');
    heading.textContent = '- LOG IN -';
    form.appendChild(heading);

    const inputEmail = document.createElement('input');
    inputEmail.placeholder = 'Enter email...';
    inputEmail.name = 'email';
    inputEmail.type = 'email';
    inputEmail.required = true;
    const iconEmail = document.createElement('img');
    iconEmail.src = '../../assets/user_icon.png'
    iconEmail.className = 'login-icon'
    let wrapped = layout.wrap([iconEmail, inputEmail], 'login-frame');    
    form.appendChild(wrapped);

    let inputPassword = document.createElement('input');
    inputPassword.placeholder = 'Enter password...';
    inputPassword.name = 'password';
    inputPassword.type = 'password';
    inputPassword.required = true;
    const iconPassword = document.createElement('img');
    iconPassword.src = '../../assets/pw_icon.png';
    iconPassword.className = 'login-icon'
    wrapped = layout.wrap([iconPassword, inputPassword], 'login-frame');
    form.appendChild(wrapped);

    const loginButton = document.createElement('button');
    loginButton.textContent = 'Login';
    loginButton.className = 'login-button';
    form.appendChild(loginButton);

    const message = document.createElement('p');
    message.className = 'login-message';
    form.appendChild(message);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        axios.post('/user/session', data)
        .then((dbRes) => {
            const loading = document.createElement('img');
            loading.src = 'https://media1.giphy.com/media/5AtXMjjrTMwvK/200w.webp?cid=ecf05e47j17yxlz64soc3pnluiirarma32n9f89qzmsz25o2&rid=200w.webp&ct=s';
            loading.alt = 'Loading...';
            loading.style.height = '100px';
            message.textContent = 'Success - Logging in...';
            form.replaceChildren(loading, message);
            setTimeout(() => {
                const userId = dbRes.data.id;
                renderNavBar();
                renderProfile(userId);
            }, 3000)        
        })
        .catch((err) => {
            if (err.response.status === 500) {
                alert('Something went wrong. Please try again.');
            } else {
                message.textContent = err.response.data.message;
                inputEmail.focus();
                inputEmail.select();
            }
        });
    });
    return form;
}