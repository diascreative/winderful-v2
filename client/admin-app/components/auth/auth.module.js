'use strict';

angular.module('winderfulAppAdmin.auth', [
  'winderfulAppAdmin.constants',
  'winderfulAppAdmin.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
