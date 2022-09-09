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
    login: () => {
        worldMap.style.display = 'none';
        badges.style.display = 'none';
        sidePanel.style.display = 'none';  
        page.style.gridArea = '1/1/3/3';     
    },
    signup: () => {
        worldMap.style.display = 'none';
        badges.style.display = 'none';
        sidePanel.style.display = 'none';  
        page.style.gridArea = '1/1/3/3';
        pageContainer.innerHTML = '';
    }
}