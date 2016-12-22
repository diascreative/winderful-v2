'use strict';

angular.module('winderfulAppAdmin')
  .config(function($stateProvider) {
    $stateProvider
      .state('installation', {
        url: '/admin/installation/:id',
        template: '<installation></installation>',
        authenticate: true
      });
  });
