// LaunchBar Action Script
include("settings.js");

function runWithString(string) {
    if (string.indexOf('@') > -1) {
        return settings();
    }

    return getHistory().map( (value) => {
        return { title: value };
    } );
}
