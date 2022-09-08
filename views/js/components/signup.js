import { layout } from "./layout.js";
import { renderLogin } from "./login.js";

const securityQuestions = {
    1: 'What city were you born in?',
    2: 'What is the name of your first pet?',
    3: 'What is your oldest sibling\'s middle name?',
    4: 'What was the first concert you attended?',
    5: 'What was the make and model of your first car?',
    6: 'In what city or town did your parents meet?'
};

export const renderSignup = () => {
    layout.signup();
    const pageContainer = document.getElementById('page-container');

    const signupContainer = document.createElement('div');
    signupContainer.id = 'signup-container';

    const signupHeading = document.createElement('h2');
    signupHeading.innerHTML = 'Sign up';

    const signupForm = document.createElement('form');
    signupForm.id = 'signup-form';

    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for','username');
    usernameLabel.innerHTML = 'Username';
    usernameLabel.className = 'signup-label';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.name = 'username';
    usernameInput.className = 'signup-input';

    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.innerHTML = 'Email';
    emailLabel.className = 'signup-label';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.className = 'signup-input';

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.innerHTML = 'Password';
    passwordLabel.className = 'signup-label';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.className = 'signup-input';

    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.setAttribute('for', 'confirm-password');
    confirmPasswordLabel.innerHTML = 'Confirm Password';
    confirmPasswordLabel.className = 'signup-label';
    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.id = 'confirm-password';
    confirmPasswordInput.name = 'confirm-password';
    confirmPasswordInput.className = 'signup-input';

    const securityQuestionLabel = document.createElement('label');
    securityQuestionLabel.setAttribute('for', 'security-question');
    securityQuestionLabel.innerHTML = 'Select a security question';
    securityQuestionLabel.className = 'signup-label';
    const securityQuestionInput = document.createElement('select');
    securityQuestionInput.id = 'security-question';
    securityQuestionInput.name = 'security-question';
    securityQuestionInput.className = 'signup-input';
    
    for(const [key, question] of Object.entries(securityQuestions)) {
        const option = document.createElement('option');
        option.value = key;
        option.innerHTML = question;
        securityQuestionInput.appendChild(option);
    }

    const securityAnswerLabel = document.createElement('label');
    securityAnswerLabel.setAttribute('for', 'security-answer');
    securityAnswerLabel.innerHTML = 'Answer';
    securityAnswerLabel.className = 'signup-label';
    const securityAnswerInput = document.createElement('input');
    securityAnswerInput.type = 'text';
    securityAnswerInput.id = 'security-answer';
    securityAnswerInput.name = 'security-answer';
    securityAnswerInput.className = 'signup-input';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.id = 'signup-button';
    submitButton.innerHTML = 'Sign up';

    signupForm.appendChild(usernameLabel);
    signupForm.appendChild(usernameInput);
    signupForm.appendChild(emailLabel);
    signupForm.appendChild(emailInput);
    signupForm.appendChild(passwordLabel);
    signupForm.appendChild(passwordInput);
    signupForm.appendChild(confirmPasswordLabel);
    signupForm.appendChild(confirmPasswordInput);
    signupForm.appendChild(securityQuestionLabel);
    signupForm.appendChild(securityQuestionInput);
    signupForm.appendChild(securityAnswerLabel);
    signupForm.appendChild(securityAnswerInput);
    signupForm.appendChild(submitButton);

    signupForm.addEventListener('submit', event => {
        event.preventDefault();
        console.log('this runs')
        const formData = new FormData(signupForm);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('confirm-password'),
            securityQuestion: formData.get('security-question'),
            securityAnswer: formData.get('security-answer')
        };
        axios.post('/user/session/signup', data).then(() => {
            console.log('signup successful');
            renderLogin();
        }).catch((err) => {
            if(err.response.status === 500) {
                alert('Sign up failed. Please try again.');
            } else {
                alert(err.response.data.message);
            }
        })
    })

    signupContainer.appendChild(signupHeading);
    signupContainer.appendChild(signupForm);

    pageContainer.appendChild(signupContainer);
    console.log('signup');
}