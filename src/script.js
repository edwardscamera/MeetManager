const { ipcMain } = require('electron');
const electron = require('electron');
const fs = require('fs');

// SET DEFAULTS
const default_settings = {
    darktheme: true,
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
    classes: [
        {
            "label": "Algebra",
            "url": "https://meet.google.com/",
            "period": 1,
            "days": ["a", "b"],
        }
    ]
};

const showPane = pane => {
    document.querySelector('#home-pane').style.display = (pane === 'home' ? 'block' : 'none');
    document.querySelector('#settings-pane').style.display = (pane === 'settings' ? 'block' : 'none');
};

// UPDATE SETTINGS TAB AND FEATURES
if (!fs.existsSync('settings.json')) {
    fs.writeFileSync('settings.json', JSON.stringify(default_settings));

    document.querySelector('#cog').style.display = 'none';
    document.querySelector('#initbutton').style.display = 'block';
    showPane('settings');
} else { showPane('home'); }
document.querySelector('#initbutton').onclick = () => {
    savClass();
    savPeriod();
    showPane('day');

    document.querySelector('#initbutton').style.display = 'none';
    document.querySelector('#cog').innerText = 'Settings';
};
let settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
const generateOptions = per => {
    let periodSelect = [];
    for (let i = 0; i < settings.period_times.length; i++) periodSelect.push({
        tag: 'option',
        content: `Period ${i + 1}`,
        selected: per === i + 1 ? "selected" : "",
    });
    return (periodSelect);
};
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
                class: ['delete'],
                onclick: () => {
                    electron.remote.dialog.showMessageBox({
                        buttons: ["Yes", "No"],
                        message: "Do you really want to delete this period?",
                        title: "Meet Manager",
                    }).then(value => {
                        if (value.response === 0) {
                            settings.classes.forEach(c => {
                                if (c.period === settings.period_times.indexOf(time) + 1) settings.classes[settings.classes.indexOf(c)].period = 1;
                            });
                            settings.period_times.splice(settings.period_times.indexOf(time), 1);

                            fs.writeFileSync('settings.json', JSON.stringify(settings));
                            updateSettings();
                        }
                    });
                }
            }
        ],
    }));

    createLayout(layout, periodtimetable);

    layout = [
        {
            tag: 'tr',
            children: [
                {
                    tag: 'td',
                    content: 'Class',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'Period',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'A Day',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'B Day',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'Link',
                    style: { fontWeight: 'bold', },
                },
                {
                    tag: 'td',
                    content: 'Icon',
                    style: { fontWeight: 'bold', },
                }
            ],
        },
    ];
    classEditor = document.querySelector('#class-editor');
    while (classEditor.children.length > 0) classEditor.children[0].remove();
    if (settings.classes.length === 0) {
        layout.push({
            tag: 'span',
            content: 'There are no classes!',
        });
    } else {
        settings.classes.forEach(clas => {
            layout.push({
                tag: 'tr',
                children: [
                    {
                        tag: 'td',
                        children: [{
                            tag: 'input',
                            placeholder: 'Class Name',
                            value: clas.label,
                        }],
                    },
                    {
                        tag: 'td',
                        children: [{
                            tag: 'select',
                            children: generateOptions(clas.period),
                        }],
                    },
                    {
                        tag: 'td',
                        children: [{
                            tag: 'input',
                            type: 'checkbox',
                            checked: clas.days.includes('a'),
                        }]
                    },
                    {
                        tag: 'td',
                        children: [{
                            tag: 'input',
                            type: 'checkbox',
                            checked: clas.days.includes('b'),
                        }]
                    },
                    {
                        tag: 'td',
                        children: [{
                            tag: 'input',
                            placeholder: 'Meeting Link',
                            value: clas.url,
                        }]
                    },
                    {
                        tag: 'td',
                        children: [{
                            tag: 'img',
                            src: clas.img ? clas.img : "laptop.png",
                            class: ["class-pic"],
                            onclick: () => {
                                let files = electron.remote.dialog.showOpenDialogSync({ properties: ["openFile"] });

                                if (!fs.existsSync('./img/')) fs.mkdirSync('./img/');
                                let onlyFileName = files[0].split('\\');
                                onlyFileName = onlyFileName[onlyFileName.length - 1];
                                fs.copyFileSync(files[0], `./img/${onlyFileName}`);

                                settings.classes[settings.classes.indexOf(clas)].img = files[0];
                                fs.writeFileSync('settings.json', JSON.stringify(settings));
                                updateSettings();
                            },
                            oncontextmenu: () => {
                                settings.classes[settings.classes.indexOf(clas)].img = null;
                                fs.writeFileSync('settings.json', JSON.stringify(settings));
                                updateSettings();
                            },
                        }]
                    },
                    {
                        tag: 'span',
                        content: '✖',
                        style: { color: '#cc0000' },
                        onmouseenter: function () { this.style.color = '#880000'; },
                        onmouseleave: function () { this.style.color = '#cc0000'; },
                        class: ['delete'],
                        onclick: () => {
                            electron.remote.dialog.showMessageBox({
                                buttons: ["Yes", "No"],
                                message: "Do you really want to delete this class?",
                                title: "Meet Manager",
                            }).then(value => {
                                if (value.response === 0) {
                                    settings.classes.splice(settings.classes.indexOf(clas), 1);

                                    fs.writeFileSync('settings.json', JSON.stringify(settings));
                                    updateSettings();
                                }
                            });
                        }
                    }
                ],
            });
        });
    }
    createLayout(layout, classEditor);
};

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
    electron.remote.dialog.showMessageBox({
        buttons: ["Yes", "No"],
        message: "Do you really want to reset the period times?",
        title: "Meet Manager",
    }).then(value => {
        if (value.response === 0) {
            settings.period_times = default_settings.period_times;
            fs.writeFileSync('settings.json', JSON.stringify(settings));
            updateSettings();
            electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Changes saved!" });
        }
    });
};
const addClass = () => {
    savClass();
    settings.classes.push({
        label: 'New Class',
        period: 1,
        days: ['a', 'b'],
        url: 'https://meet.google.com/',
    });
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    updateSettings();
    refreshClassBar();
};
const savClass = showInfo => {
    let guipers = Array.from(document.querySelector('#class-editor').children);
    guipers.splice(0, 1);
    let checkDays = og => {
        days = [];
        if (og.children[2].children[0].checked) days.push("a");
        if (og.children[3].children[0].checked) days.push("b");
        return days;
    };
    guipers = guipers.map(og => ({
        label: og.children[0].children[0].value,
        period: window.parseInt(og.children[1].children[0].value.split("Period ")[1]),
        days: checkDays(og),
        url: og.children[4].children[0].value,
    }));
    settings.classes = guipers;
    fs.writeFileSync('settings.json', JSON.stringify(settings));
    updateSettings();
    if (showInfo) electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Changes saved!" });
    refreshClassBar();
};
const resClass = () => {
    electron.remote.dialog.showMessageBox({
        buttons: ["Yes", "No"],
        message: "Do you really want to reset your classes?",
        title: "Meet Manager",
    }).then(value => {
        if (value.response === 0) {
            settings.classes = default_settings.classes;
            fs.writeFileSync('settings.json', JSON.stringify(settings));
            updateSettings();
            electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Changes saved!" });
            refreshClassBar();
        }
    });

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
    let new_period_times = settings.period_times.map(old_time => ({
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
        settings.classes.forEach(c => {
            if (c.period - 1 === period && c.days.includes(document.querySelector('#dayswitchbox').checked ? 'b' : 'a')) final_c = c;
        });
        document.querySelector('#big-button-text').innerText = final_c.label;
        document.querySelector('#big-button-img').style.display = 'block';
        document.querySelector('#big-button-img').src = final_c.img ? final_c.img : 'laptop_icon.png';
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
    settings.classes.forEach(c => {
        let day = document.querySelector('#dayswitchbox').checked ? 'b' : 'a';

        if (c.days.includes(day)) {
            const subcontainer = document.createElement('div');
            subcontainer.classList.add('class');
            subcontainer.addEventListener('click', () => electron.ipcRenderer.send('load-url', [c.url, c.label]));
            subcontainer.addEventListener('contextmenu', () => electron.shell.openExternal(c.url));

            const label = document.createElement('span');
            label.innerText = c.label;

            const image = document.createElement('img');
            image.src = c.img ? c.img : 'laptop_icon.png';
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
cog.addEventListener('click', () => {
    if (cog.innerText === 'Settings') {
        cog.innerText = 'Back';
        document.querySelector('#home-pane').style.display = 'none';
        document.querySelector('#settings-pane').style.display = 'block';
    } else {
        cog.innerText = 'Settings';
        refreshClassBar();
        document.querySelector('#home-pane').style.display = 'block';
        document.querySelector('#settings-pane').style.display = 'none';
    }
});

document.querySelector('#darkthemebox').addEventListener('change', () => {
    settings.darktheme = document.querySelector('#darkthemebox').checked;
    document.querySelector('#darktheme').disabled = !settings.darktheme;

    fs.writeFileSync('settings.json', JSON.stringify(settings));
});

const importSettings = () => {
    const file = document.querySelector('#importsettingsfile');
    if (!file.files[0].path.endsWith('.json')) {
        electron.remote.dialog.showErrorBox('Meet Manager', 'Settings file must be a JSON file. Make sure the file extension ends in .json and try again.');
        file.value = "";
        return;
    }
    let filedat = JSON.parse(fs.readFileSync(file.files[0].path, 'utf8'));
    if (!filedat.period_times || !filedat.classes) {
        electron.remote.dialog.showErrorBox('Meet Manager', 'File is corrupt.');
    } else {
        fs.copyFileSync(file.files[0].path, 'settings.json');
        electron.remote.dialog.showMessageBoxSync({ type: "info", title: "Meet Manager", message: "Settings file imported!" });
    }
    file.value = "";
    electron.ipcRenderer.send('load-index');
    refreshClassBar();
    updateSettings();
};
const exportSettings = () => {
    if (!fs.existsSync(`${process.env.HOME}\\myclasssettings`)) fs.mkdirSync(`${process.env.HOME}\\myclasssettings`);
    fs.copyFileSync('settings.json', `${process.env.HOME}\\myclasssettings\\myclasssettings.json`);
    require('child_process').exec(`start "" "${process.env.HOME}\\myclasssettings"`);
};