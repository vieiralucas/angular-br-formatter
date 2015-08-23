angular
    .filter('phoneFormatBr', phoneFormat);
    .module('br-formatter')

function phoneFormat(value) {
    if (!value || typeof value !== 'string') {
        return '';
    }

    value = value.replace(/[^0-9.]/g, ""); // remove everything but digits

    var length = value.length;

    if (length < 6) {
        return value;
    } else {
        if (length < 7) {
            return '(' + value.substring(0, 2) + ') ' + value.substring(2, length);
        } else if (length === 9) {
            return '(' + value.substring(0, 2) + ') ' + value.substring(2, 5) + '-' + value.substring(5, length);
        } else {
            return '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6, length);
        }
    }
}

