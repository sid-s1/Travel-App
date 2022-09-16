import { layout } from "./layout.js";
import { HtmlElements } from './html-elements.js';
import { renderLogin } from "./login.js";

export const securityQuestions = {
    1: 'What city were you born in?',
    2: 'What is the name of your first pet?',
    3: 'What is your oldest sibling\'s middle name?',
    4: 'What was the first concert you attended?',
    5: 'What was the make and model of your first car?',
    6: 'In what city or town did your parents meet?'
};

export const renderSignup = () => {
    layout.reset();
    layout.signup();
    const pageContainer = document.getElementById('page-container');

    const signupContainer = HtmlElements.createDiv(id = 'signup-container');

    const signupHeading = document.createElement('h2');
    signupHeading.innerHTML = 'Sign up';

    const signupForm = document.createElement('form');
    signupForm.id = 'signup-form';

    const usernameLabel = HtmlElements.createLabel('username', 'Username', 'signup-label');
    const usernameInput = HtmlElements.createInput('text', 'username', 'username', 'signup-input');

    const emailLabel = HtmlElements.createLabel('email', 'Email', 'signup-label');
    const emailInput = HtmlElements.createInput('email', 'email', 'email', 'signup-input');

    const passwordLabel = HtmlElements.createLabel('password', 'Password', 'signup-label');
    const passwordInput = HtmlElements.createInput('password', 'password', 'password', 'signup-input');

    const confirmPasswordLabel = HtmlElements.createLabel('confirm-password', 'Confirm Password', 'signup-label');
    const confirmPasswordInput = HtmlElements.createInput('password', 'confirm-password', 'confirm-password', 'signup-input');

    const securityQuestionLabel = HtmlElements.createLabel('security-question', 'Select a security question', 'signup-label');
    const securityQuestionInput = document.createElement('select');

    securityQuestionInput.id = 'security-question';
    securityQuestionInput.name = 'security-question';
    securityQuestionInput.className = 'signup-input';

    for (const [key, question] of Object.entries(securityQuestions)) {
        const option = document.createElement('option');
        option.value = key;
        option.innerHTML = question;
        securityQuestionInput.appendChild(option);
    }

    const securityAnswerLabel = HtmlElements.createLabel('security-answer', 'Answer', 'signup-label');
    const securityAnswerInput = HtmlElements.createInput('text', 'security-answer', 'security-answer', 'signup-input');

    const submitButton = HtmlElements.createButton('submit', 'Sign up', 'signup-button')

    signupForm.append(usernameLabel, usernameInput, emailLabel, emailInput, passwordLabel, passwordInput, confirmPasswordLabel, confirmPasswordInput, securityQuestionLabel, securityQuestionInput, securityAnswerLabel, securityAnswerInput, submitButton);

    signupForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            confirmedPassword: formData.get('confirm-password'),
            securityQuestion: formData.get('security-question'),
            securityAnswer: formData.get('security-answer')
        };
        const password = formData.get('password');
        if (password != data.confirmedPassword) {
            alert('Passwords do not match');
        } else {
            axios.post('/user/session/signup', data)
                .then(() => {
                    console.log('signup successful');
                    renderLogin();
                })
                .catch((err) => {
                    if (err.response.status === 500) {
                        alert('Sign up failed. Please try again.');
                    } else {
                        alert(err.response.data.message);
                    }
                })
        }
    })

    signupContainer.appendChild(signupHeading);
    signupContainer.appendChild(signupForm);

    pageContainer.appendChild(signupContainer);
}