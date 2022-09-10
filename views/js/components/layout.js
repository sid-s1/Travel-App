const gridContainer = document.getElementById('grid-container');
const worldMap = document.getElementById('world-map');
const sidePanel = document.getElementById('side-panel');
const badges = document.getElementById('badges');
const page = document.getElementById('page');
const pageContainer = document.getElementById('page-container');

export const layout = {
    // wrap content in an outer div. Assign class name, if required.
    wrap: (items, assignClass) => {
        const div = document.createElement('div');
        if (assignClass) {
            div.className = assignClass
        }
        for (let i = 0; i < items.length; i++) {
            div.appendChild(items[i])
        }
        return div;
    },
    // login view
    reset: () => {
        worldMap.style.display = 'none';        
        badges.style.display = 'none';        
        sidePanel.style.display = 'none';         
        page.style.display = 'none';
        worldMap.style.gridArea = '1/1/1/3';
        badges.style.gridArea = '2/2/2/3';
        sidePanel.style.gridArea = '2/1/4/2';
        page.style.gridArea = '3/2/3/3';
    },
    login: () => {
        page.style.display = 'flex';  
        page.style.gridArea = '1/1/3/3';
        pageContainer.innerHTML = '';     
    },
    signup: () => {
        page.style.display = 'flex';
        page.style.gridArea = '1/1/3/3';
        pageContainer.innerHTML = '';
    },
    profile: () => {
        worldMap.style.display = 'flex';        
        badges.style.display = 'flex';        
        sidePanel.style.display = 'flex';         
        page.style.display = 'flex';
        badges.innerHTML = '';
        sidePanel.innerHTML = '';
        pageContainer.innerHTML = 'PROFILE VIEW / LOGGED IN';
    }
}