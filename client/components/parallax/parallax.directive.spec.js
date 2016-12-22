// 'use strict';
//
// describe('Directive: parallax', function () {
//
//   // load the directive's module
//   beforeEach(module('sunfulApp'));
//
//   var element,
//     scope;
//
//   beforeEach(inject(function ($rootScope, $provide) {
//     scope = $rootScope.$new();
//     $provide.value('$log', console);
//   }));
//
//   it('should make hidden element visible', inject(function ($compile) {
//     mockWindow.scrollTo(0, 100);
//
//     element = angular.element('<parallax parallax-top="0"></parallax>');
//     element = $compile(element)(scope);
//
//     $provide.value('$log', console);
//
//     expect(element).toBe('this is the parallax directive');
//   }));
// });
