
// Render top navigation bar
export const renderNavBar = () => {
    const navBar = document.getElementById('nav-bar');
    navBar.innerHTML = '';
    
    const h1 = document.createElement('h1');
    h1.id = 'logo';
    h1.textContent = 'TRIPT';
    navBar.appendChild(h1);

    const navList = document.createElement('ul');
    navList.id = 'navlist';

    // ** The following are placeholder buttons that will eventually only render under certain situations (eg. logged in / not logged in)
    // ** or we can store them into a hamburger menu? (maybe when user screen size is < a certain size)

    // BUTTON - MY PROFILE
    const profileButton = document.createElement('li');
    profileButton.textContent = 'My Profile';
    profileButton.style.backgroundColor = 'red' // **remove once functionality added
    profileButton.addEventListener('click', () => {
        // Render user profile
    });
    navList.appendChild(profileButton);

    // BUTTON - SETTINGS
    const settingsButton = document.createElement('li');
    settingsButton.textContent = 'Settings';
    settingsButton.style.backgroundColor = 'red' // **remove once functionality added
    settingsButton.addEventListener('click', () => {
        // Render user settings (modal?)
    });
    navList.appendChild(settingsButton);

    // BUTTON - SIGN UP
    const signupButton = document.createElement('li');
    signupButton.textContent = 'Sign Up';
    signupButton.style.backgroundColor = 'red' // **remove once functionality added
    signupButton.addEventListener('click', () => {
        // Render sign up form
    });
    navList.appendChild(signupButton);

    // BUTTON - LOGIN
    const loginButton = document.createElement('li');
    loginButton.textContent = 'Login';
    loginButton.style.backgroundColor = 'red' // **remove once functionality added
    loginButton.addEventListener('click', () => {
        // Log user in + create session
    });
    navList.appendChild(loginButton);

    // BUTTON - LOGOUT
    const logoutButton = document.createElement('li');
    logoutButton.textContent = 'Logout';
    logoutButton.style.backgroundColor = 'red' // **remove once functionality added
    logoutButton.addEventListener('click', () => {
        // Log user out + destroy session
        location.href = '/'; // Reload index.html               
    });
    navList.appendChild(logoutButton);
    navBar.appendChild(navList);
}
