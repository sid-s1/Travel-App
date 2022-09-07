import { layout } from './layout.js';

export const renderLogin = () => {
    layout.login()

    const pageContainer = document.getElementById('page-container');
    pageContainer.innerHTML = '';
    const test = document.createElement('p')
    test.textContent = 'this is a test'    
    pageContainer.appendChild(test)    
}
 