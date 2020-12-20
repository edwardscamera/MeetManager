const electron = require('electron');
const fs = require('fs');

// SET DEFAULTS
const default_settings = {
    darktheme: false,
    period_times: [
        {
            'start': '07:00',
            'end': '08:09',
        }, {
            'start': '08:10',
            'end': '08:54',
        }, {
            'start': '08:55',
            'end': '09:39',
        }, {
            'start': '09:40',
            'end': '10:24',
        }, {
            'start': '10:25',
            'end': '11:09',
        }, {
            'start': '11:10',
            'end': '11:54',
        }, {
            'start': '11:55',
            'end': '12:39',
        }, {
            'start': '12:40',
            'end': '13:24',
        }, {
            'start': '13:25',
            'end': '14:13',
        },
    ],
};
const classes = [
    {
        'label': 'AP Seminar',
        'url': 'https://meet.google.com/yiv-dhek-jmp',
        'period': 1,
        'days': ['a', 'b'],
    }, {
        'label': 'Algebra II',
        'url': 'https://meet.google.com/',
        'period': 2,
        'days': ['a', 'b'],
    }, {
        'label': 'AP CSP',
        'url': 'https://meet.google.com/',
        'period': 3,
        'days': ['a', 'b'],
    }, {
        'label': 'Orchestra',
        'url': 'https://meet.google.com/gue-xnoh-zua',
        'period': 4,
        'days': ['a', 'b'],
    }, {
        'label': 'AP World',
        'url': 'https://meet.google.com/',
        'period': 5,
        'days': ['a', 'b'],
    }, {
        'label': 'Spanish III',
        'url': 'https://meet.google.com/',
        'period': 6,
        'days': ['a', 'b'],
    },
    {
        'label': 'Gym',
        'url': 'https://meet.google.com/',
        'period': 8,
        'days': ['a'],
    },
    {
        'label': 'Chemistry',
        'url': 'https://meet.google.com/',
        'period': 8,
        'days': ['b'],
    },
    {
        'label': 'Chemistry',
        'url': 'https://meet.google.com/',
        'period': 9,
        'days': ['a', 'b'],
    },
];

// UPDATE SETTINGS TAB AND FEATURES
const updateSettings = () => {
    settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

    document.querySelector('#darkthemebox').checked = settings.darktheme;
    document.querySelector('#darktheme').disabled = !settings.darktheme;
    settings.darktheme = document.querySelector('#darkthemebox').checked;

    const periodtimetable = document.querySelector('#period-times-parent');
    while (periodtimetable.children.length > 0) periodtimetable.children[0].remove();

    let layout = [
        {
            tag: 'tr',
            children: [
                {
                    tag: 'td',
                    content: 'Period',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'Start',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'End',
                    style: { fontWeight: 'bold', },
                },
            ],
        },
    ];

    settings.period_times.forEach(time => layout.push({
        tag: 'tr',
        children: [
            {
                tag: 'td',
                content: settings.period_times.indexOf(time) + 1,
            },
            {
                tag: 'td',
                children: [
                    {
                        tag: 'input',
                        type: 'time',
                        value: time.start,
                        oninput: function () {
                            console.log(this.value);
                        },
                    }
                ],
            },
            {
                tag: 'td',
                children: [
                    {
                        tag: 'input',
                        type: 'time',
                        value: time.end,
                        oninput: function () {
                            console.log(this.value);
                        },
                    }
                ],
            },
            {
                tag: 'span',
                content: '✖',
                style: { color: '#cc0000' },
                onmouseenter: function () { this.style.color = '#880000'; },
                onmouseleave: function () { this.style.color = '#cc0000'; },
                onclick: () => {
                    settings.period_times.splice(settings.period_times.indexOf(time), 1);
                    fs.writeFileSync('settings.json', JSON.stringify(settings));
                    updateSettings();
                }
            }
        ],
    }));

    createLayout(layout, periodtimetable);
};

// CREATE SETTINGS.JSON
if (!fs.existsSync('settings.json')) fs.writeFileSync('settings.json', JSON.stringify(default_settings));
let settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
let period_times = settings.period_times;

// APPEND DEFAULT SETTINGS IF CORRUPT
if (!fs.existsSync('settings.json')) fs.writeFileSync('settings.json', JSON.stringify(default_settings));
Object.keys(default_settings).forEach(key => {
    if (!settings[key]) settings[key] = default_settings[key];
});
fs.writeFileSync('settings.json', JSON.stringify(settings));

updateSettings();

const addPeriod = () => {
    savPeriod();
    lastperiod = settings.period_times[settings.period_times.length - 1].end;
    lastperiod = window.parseInt(lastperiod.split(":")[0] * 60) + window.parseInt(lastperiod.split(":")[1]);

    newstart = lastperiod + 1;
    hour = Math.floor(newstart / 60).toString();
    hour = (hour.length === 1 ? "0" + hour : hour);
    min = Math.floor(newstart % 60).toString();
    min = (min.length === 1 ? "0" + min : min);
    newstart = `${hour}:${min}`;

    newend = lastperiod + 46;
    hour = Math.floor(newend / 60).toString();
    hour = (hour.length === 1 ? "0" + hour : hour);
    min = Math.floor(newend % 60).toString();
    min = (min.length === 1 ? "0" + min : min);
    newend = `${hour}:${min}`;


    settings.period_times.push({
        start: newstart,
        end: newend,
    });
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    updateSettings();
};
const savPeriod = showInfo => {
    let guipers = Array.from(document.querySelector('#period-times-parent').children);
    guipers.splice(0, 1);
    guipers = guipers.map(og => ({
        start: og.children[1].children[0].value,
        end: og.children[2].children[0].value,
    }));
    settings.period_times = guipers;
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    updateSettings();
    if (showInfo) electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Changes saved!" });
};
const resPeriod = () => {
    settings.period_times = default_settings.period_times;
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    updateSettings();
    electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Changes saved!" });
};

// Returns local time as string in HH:MM format
const getTime = (format, code) => {
    let date = new Date();
    let hours = date.getHours().toString().length === 1 ? `0${date.getHours()}` : date.getHours();
    let minutes = date.getMinutes().toString().length === 1 ? `0${date.getMinutes()}` : date.getMinutes();

    let timecode = '';
    if (format && code) timecode = hours > 12 ? 'PM' : 'AM';
    if (hours > 12 && format) hours -= 12;

    return `${hours}:${minutes} ${timecode}`;
};

// Returns class period based on time in HH:MM format and period_times
const getPeriod = time => {
    let new_time_arg = window.parseInt(time.split(':')[0]) * 60 + window.parseInt(time.split(':')[1]);
    let new_period_times = period_times.map(old_time => ({
        'start': window.parseInt(old_time.start.split(':')[0]) * 60 + window.parseInt(old_time.start.split(':')[1]),
        'end': window.parseInt(old_time.end.split(':')[0]) * 60 + window.parseInt(old_time.end.split(':')[1]),
    }));
    let per = -1;
    new_period_times.forEach(new_time => {
        if (new_time_arg >= new_time.start && new_time_arg <= new_time.end) per = new_period_times.indexOf(new_time);
    });
    return (per);
};

// Refresh clock and big button
const refreshTime = () => {
    let time;
    time = getTime(false);
    document.querySelector('#time').innerText = getTime(true, true);

    let period = getPeriod(time);

    if (period !== -1 && ![0, 6].includes((new Date()).getDay())) {
        let final_c = null;
        classes.forEach(c => {
            if (c.period - 1 === period && c.days.includes(document.querySelector('#dayswitchbox').checked ? 'b' : 'a')) final_c = c;
        });
        document.querySelector('#big-button-text').innerText = final_c.label;
        document.querySelector('#big-button-img').style.display = 'block';
        document.querySelector('#big-button-img').onclick = () => electron.ipcRenderer.send('load-url', [final_c.url, final_c.label]);
        document.querySelector('#big-button-img').oncontextmenu = () => electron.shell.openExternal(final_c.url);
    } else {
        document.querySelector('#big-button-text').innerText = 'there is no class right now';
        document.querySelector('#big-button-img').style.display = 'none';
    }
};
refreshTime();
window.setInterval(refreshTime, 1000);

// Create class bar
const refreshClassBar = () => {
    const container = document.querySelector('#class-container');
    while (container.children.length > 0) container.children[0].remove();
    classes.forEach(c => {
        let day = document.querySelector('#dayswitchbox').checked ? 'b' : 'a';

        if (c.days.includes(day)) {
            const subcontainer = document.createElement('div');
            subcontainer.classList.add('class');
            subcontainer.addEventListener('click', () => electron.ipcRenderer.send('load-url', [c.url, c.label]));
            subcontainer.addEventListener('contextmenu', () => electron.shell.openExternal(c.url));

            const label = document.createElement('span');
            label.innerText = c.label;

            const image = document.createElement('img');
            image.src = 'laptop.png';
            image.draggable = false;

            subcontainer.append(image, document.createElement('br'), label);
            container.appendChild(subcontainer);
        }
    });
};

window.addEventListener('load', refreshClassBar);

document.querySelector('#dayswitchbox').addEventListener('change', refreshClassBar);
document.querySelector('#dayswitchbox').addEventListener('change', refreshTime);

const cog = document.querySelector('#cog');
document.querySelector('#home-pane').style.display = 'block';
document.querySelector('#settings-pane').style.display = 'none';
cog.addEventListener('click', () => {
    if (cog.innerText === 'Settings') {
        cog.innerText = 'Back';
        document.querySelector('#home-pane').style.display = 'none';
        document.querySelector('#settings-pane').style.display = 'block';
    } else {
        cog.innerText = 'Settings';
        document.querySelector('#home-pane').style.display = 'block';
        document.querySelector('#settings-pane').style.display = 'none';
    }
});

document.querySelector('#darkthemebox').addEventListener('change', () => {
    settings.darktheme = document.querySelector('#darkthemebox').checked;
    document.querySelector('#darktheme').disabled = !settings.darktheme;

    fs.writeFileSync('settings.json', JSON.stringify(settings));
});