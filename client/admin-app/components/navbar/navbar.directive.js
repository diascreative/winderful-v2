'use strict';

angular.module('winderfulAppAdmin')
  .directive('navbar', () => ({
    templateUrl: 'admin-app/components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));
