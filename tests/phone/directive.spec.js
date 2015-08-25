describe('Directive: brPhone', function() {
    'use strict';

    var brPhoneFormatter, rootScope,  scope, element, compile;

    beforeEach(function() {
        module('br-formatter');

        inject(function(_$filter_, $rootScope, $compile) {
            brPhoneFormatter = _$filter_('brPhoneFormatter');
            rootScope = $rootScope;
            scope = rootScope.$new();
            compile = $compile;
            element = '<input type="text" ng-model="phone" br-phone/>';

            scope.phone = '1234567890';
            element = compile(element)(scope);
            scope.$digest();
        });
    });

    describe('with first value given', function() {
        it('should leave undefined if undefined given', function() {
            scope = rootScope.$new();
            scope.phone = undefined;
            element = '<input type="text" ng-model="phone" br-phone/>';
            element = compile(element)(scope);
            scope.$digest();

            expect(scope.phone).toBeUndefined();
        });
        it('should format given model using brPhoneFormatter filter', function() {
            expect(element.val()).toBe(brPhoneFormatter('1234567890'));
        });
    });

    describe('when changing initial value', function() {
        it('should format new value using brPhoneFormatter filter', function() {
            scope.phone = '0987654321';
            scope.$digest();

            expect(element.val()).toBe(brPhoneFormatter('0987654321'));
        });
    });
});
