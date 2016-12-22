'use strict';

angular.module('winderfulAppAdmin')
  .config(function($stateProvider) {
    $stateProvider
      .state('installations', {
        url: '/admin/installations',
        template: '<installations></installations>',
        authenticate: true
      });
  });
