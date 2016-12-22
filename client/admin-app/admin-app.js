'use strict';

angular.module('winderfulAppAdmin', [
  'winderfulAppAdmin.auth',
  'winderfulAppAdmin.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',
  'angularFileUpload',
  'ui-notification'
])
.config(function($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/admin');

    $locationProvider
      .hashPrefix(false)
      .html5Mode(true);

    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<installations></installations>',
        authenticate: false
      })
      .state('login', {
        url: '/admin/login',
        templateUrl: 'admin-app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/admin/logout?referrer',
        referrer: 'admin',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'admin';
          Auth.logout();
          $state.go(referrer);
        }
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
