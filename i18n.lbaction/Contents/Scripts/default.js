// LaunchBar Action Script
include("settings.js");

function run(argument) {
    if (argument == undefined) {
        LaunchBar.openURL('https://i18ns.com');
    } else if (argument.indexOf('@token') > -1) {
        const token = argument.split(' ').pop();
        return login(token);
    } else if (argument.indexOf('@fromLang') > -1) {
        const lang = argument.split(' ').pop();
        return fromLang(lang);
    } else if (argument.indexOf('@targetLang') > -1) {
        const lang = argument.split(' ').pop();
        return targetLang(lang);
    } else {
        storeToSearchHistory(argument);

        const token = getToken();
        if (token == undefined) {
            return [
                { title: 'A token must be set before using this action' },
                { title: 'Get a token', url: "https://i18ns.com" },
                { title: 'Then setup token with @token xxxxx command', }
            ];
        }

        let fromLang = getFromLang();
        const result = HTTP.loadRequest('https://i18ns.com/api/v1/search', {
            body: {
                language: fromLang,
                content: argument
            },
            headerFields: {
                'x-access-token': token
            },
            bodyType: 'json',
            method: 'POST',
            resultType: 'json'
        });

        if (result.error != undefined) {
            LaunchBar.alert(result.error);
            return settings();
        } else {
            return convertResponseToOuput(result.data);
        }
    }
}

/**
 * @param {Array} json The returned result is an array of translations.
 * @returns {Array} 
 */
function convertResponseToOuput(json) {
    return json.map( (value) => {
        const format = value.format;
        const translations = value.translations;
        let preferredTargetLang = getTargetLang();

        if (format == 0) { 
            const mainTranslation = translations[preferredTargetLang].shift();
            return {
                title: mainTranslation,
                badge: preferredTargetLang,
                children: Object.keys(translations).map( (key) => {
                    return {
                        title: translations[key].shift(),
                        badge: key
                    };
                } )
            };
        } else {
            const mainTranslation = translations[preferredTargetLang];
            return {
                title: mainTranslation.join(', '),
                badge: preferredTargetLang,
                children: Object.keys(translations).map((key) => {
                    return {
                        title: translations[key].join(', '),
                        badge: key,
                        children: translations[key].map ( (value) => {
                            return {
                                title: value,
                                badge: key,
                            };
                        } )
                    }
                })
            };
        }
    });
}

