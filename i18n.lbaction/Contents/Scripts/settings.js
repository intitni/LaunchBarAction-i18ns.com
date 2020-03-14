// LaunchBar Action Script

const defaultFromLang = 'zh';
const defaultTargetLang = 'en';

function settings(argument) {
    let token = getToken();
    if (token == undefined) { token = 'none'; }

    return [
        {
            title: 'Token',
            badge: token
        }, {
            title: 'From Language',
            badge: getFromLang()
        }, {
            title: 'Preferred Language',
            badge: getTargetLang()
        }
    ];
}

function login(argument) {
    if (argument != undefined && argument != '@token') {
        setToken(argument)
    }

    return settings();
}

function fromLang(argument) {
    if (argument != undefined && argument != '@fromLang') {
        setFromLang(argument)
    }

    return settings();
}

function targetLang(argument) {
    if (argument != undefined && argument != '@targetLang') {
        setTargetLang(argument)
    }

    return settings();
}

function getTargetLang() {
    let targetLang = Action.preferences.targetLang;
    if (targetLang == undefined) { targetLang = defaultTargetLang; }
    return targetLang;
}

function setTargetLang(lang) {
    Action.preferences.targetLang = lang;
}

function getFromLang() {
    let fromLang = Action.preferences.fromLang;
    if (fromLang == undefined) { fromLang = defaultFromLang; }
    return fromLang;
}

function setFromLang(lang) {
    Action.preferences.fromLang = lang;
}

function getToken() {
    return Action.preferences.token;
}

function setToken(token) {
    Action.preferences.token = token;
}

/**
 * @returns {Array<String>} 
 */
function getHistory() {
    const history = Action.preferences.history;
    if (history instanceof Array) { return history; }
    return [];
}

function storeToSearchHistory(argument) {
    if (argument == undefined || argument.length == 0) { return; }
    let history = getHistory();
    history.unshift(argument);
    Action.preferences.history = history.slice(0, 9);
}