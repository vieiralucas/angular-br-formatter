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

