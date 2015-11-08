export default class Utilities {
    static formatSeconds(number) {
        var timeToDisplay = [];

        number = parseInt(number, 10);

        var hours = Math.floor(number / 3600);
        var minutes = Math.floor((number - (hours * 3600)) / 60);
        var seconds = number - (hours * 3600) - (minutes * 60);

        // hours = CompleteString.withZero(hours, 2);
        minutes = CompleteString.withZero(minutes, 2);
        seconds = CompleteString.withZero(seconds, 2);

        // timeToDisplay.push(hours);
        timeToDisplay.push(minutes);
        timeToDisplay.push(seconds);

        return timeToDisplay.join(':');
    }
}
