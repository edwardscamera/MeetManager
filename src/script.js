const electron = require('electron');
const classes = [
    {
        'label': 'AP Seminar',
        'url': 'https://meet.google.com/yiv-dhek-jmp',
    },
    {
        'label': 'Algebra II',
        'url': 'https://meet.google.com/',
    },
    {
        'label': 'AP CSP',
        'url': 'https://meet.google.com/',
    },
    {
        'label': 'Orchestra',
        'url': 'https://meet.google.com/',
    },
    {
        'label': 'AP World',
        'url': 'https://meet.google.com/',
    },
    {
        'label': 'Spanish III',
        'url': 'https://meet.google.com/',
    },
    {
        'label': 'Chemistry',
        'url': 'https://meet.google.com/',
    },
];
const container = document.querySelector('#class-container');
window.addEventListener('load', () => {
    classes.forEach(c => {
        const subcontainer = document.createElement('div');
        subcontainer.classList.add('class');
        subcontainer.addEventListener('click', () => electron.ipcRenderer.send('load-url', c.url));

        const label = document.createElement('span');
        label.innerText = c.label;

        const image = document.createElement('img');
        image.src = 'laptop.png';
        image.draggable = false;

        subcontainer.append(image, document.createElement('br'), label);
        container.appendChild(subcontainer);
    });
});