import { renderLogin } from './login.js'
import { renderSignup } from './signup.js';
import { renderProfile } from './profile.js';
import { logout } from './logout.js';
import { renderPublicHomepage } from './public-homepage.js'

// Render top navigation bar
export const renderNavBar = () => {
    const navBar = document.getElementById('nav-bar');
    navBar.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.id = 'logo';
    h1.textContent = 'TRIPT';
    h1.addEventListener('click', () => {
        window.location = '/';
    })
    h1.style.cursor = 'pointer';
    navBar.appendChild(h1);
    const navList = document.createElement('ul');
    navList.id = 'navlist';

    axios.get('/user/session')
    .then(dbRes => {
        if (dbRes) {
            // LOGGED IN:
            renderProfile();

            // Button - My Profile
            const profileButton = document.createElement('li');
            profileButton.textContent = 'My Profile';
            profileButton.addEventListener('click', () => {
                renderProfile();
            });
            navList.appendChild(profileButton);

            // Button - Settings
            const settingsButton = document.createElement('li');
            settingsButton.textContent = 'Settings';
            settingsButton.style.backgroundColor = 'red' // **remove once functionality added
            settingsButton.addEventListener('click', () => {
                // Render user settings (modal?)
            });
            navList.appendChild(settingsButton);

            // Button - Logout
            const logoutButton = document.createElement('li');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', () => {
                logout();
            });
            navList.appendChild(logoutButton);
            navBar.appendChild(navList);
        }
    }).catch(err => {
            if (err.response.status === 500) {
                alert('An unknown error occured. Please refresh your page')
            } else {
                // NOT LOGGED IN:
                renderPublicHomepage();

                // Button - Sign Up
                const signupButton = document.createElement('li');
                signupButton.textContent = 'Sign Up';
                signupButton.addEventListener('click', () => {
                    renderSignup();
                });
                navList.appendChild(signupButton);

                // Button - Login
                const loginButton = document.createElement('li');
                loginButton.textContent = 'Login';
                loginButton.addEventListener('click', () => {
                    renderLogin();
                });
                navList.appendChild(loginButton);
                navBar.appendChild(navList);
            }
    });
}
