(function() {
    'use strict';

    angular.module('br-formatter', []);
}());

(function() {
    'use strict';

    angular
        .module('br-formatter')
        .directive('brPhone', brPhone);

    brPhone.$inject = ['$filter'];
    function brPhone($filter) {
        var brPhoneFormatter = $filter('brPhoneFormatter');

        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                ngModel: '='
            },
            link: linkFn
        };

        function linkFn(scope) {
            if (scope.ngModel) {
                scope.ngModel = brPhoneFormatter(scope.ngModel);
            }

            scope.$watch('ngModel', function(newVal, oldVal) {
                if (oldVal || newVal !== oldVal) {
                    scope.ngModel = brPhoneFormatter(scope.ngModel);
                }
            });
        }
    }
}());


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

