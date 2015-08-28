describe('Filter: brPhoneFormatter', function() {
    'use strict';

    var $filter;

    beforeEach(function() {
        module('br-formatter');

        inject(function(_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should return empty string if no string is given', function() {
        expect($filter('brPhoneFormatter')()).toEqual(''); // undefined
        expect($filter('brPhoneFormatter')(1)).toEqual(''); // number
        expect($filter('brPhoneFormatter')(true)).toEqual(''); // bolean
        expect($filter('brPhoneFormatter')(null)).toEqual(''); // null
        expect($filter('brPhoneFormatter')([])).toEqual(''); // array
        expect($filter('brPhoneFormatter')({})).toEqual(''); // object
    });

    it('should remove everything but digits', function() {
        expect($filter('brPhoneFormatter')('abc12')).toEqual('12');
        expect($filter('brPhoneFormatter')('!@#12')).toEqual('12');
    });

    it('should limit to 11 digits', function() {
        expect($filter('brPhoneFormatter')('123456789012')).toEqual('(12) 3456-78901');
    });

    it('should just return given digits until length is bigger than 5', function() {
        expect($filter('brPhoneFormatter')('1')).toEqual('1');
        expect($filter('brPhoneFormatter')('12')).toEqual('12');
        expect($filter('brPhoneFormatter')('123')).toEqual('123');
        expect($filter('brPhoneFormatter')('1234')).toEqual('1234');
        expect($filter('brPhoneFormatter')('12345')).toEqual('12345');

        expect($filter('brPhoneFormatter')('123456')).not.toEqual('123456');
    });

    it('should format ddd if length is bigger than 5 but less than 7', function() {
        expect($filter('brPhoneFormatter')('123456')).toEqual('(12) 3456');
    });

    it('should format as (dd) ddd-dddd if length is equal to 9', function() {
        expect($filter('brPhoneFormatter')('123456789')).toEqual('(12) 345-6789');
    });

    it('should format as (dd) dddd-dddd... if length is bigger than 6 but not 9', function() {
        expect($filter('brPhoneFormatter')('1234567')).toEqual('(12) 3456-7');
        expect($filter('brPhoneFormatter')('12345678')).toEqual('(12) 3456-78');
        expect($filter('brPhoneFormatter')('1234567890')).toEqual('(12) 3456-7890');
    });
});
