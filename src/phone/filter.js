(function() {
    'use strict';

    angular
        .module('br-formatter')
        .filter('brPhoneFormatter', brPhoneFormatter);

    function brPhoneFormatter() {
        return function(value) {
            if (!value || typeof value !== 'string') {
                return '';
            }

            value = value.replace(/[^0-9.]/g, ''); // remove everything but digits
            value = value.substring(0, 11); // limit to 11 digits

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
        };
    }
}());

