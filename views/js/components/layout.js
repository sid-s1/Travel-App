const gridContainer = document.getElementById('grid-container');
const worldMap = document.getElementById('world-map');
const sidePanel = document.getElementById('side-panel');
const badges = document.getElementById('badges');
const page = document.getElementById('page');
const pageContainer = document.getElementById('page-container');

export const layout = {
    login: () => {
        worldMap.style.display = 'none'
        badges.style.display = 'none';
        sidePanel.style.display = 'none';  
        page.style.gridArea = '1/1/3/3';     
    }
}