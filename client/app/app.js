'use strict';

function updateOnlineStatus() {
  if (navigator.onLine) {
    $('.offline-message').removeClass('visible');
  } else {
    $('.offline-message')
      .addClass('visible')
      .text('There is no Internet connection');
  }
}

$(window).bind('online offline',  updateOnlineStatus);

angular.module('winderfulApp', [
  'ngResource',
  'ngSanitize',
  'ui.router',
  '720kb.socialshare',
  'angular-rickshaw',
  'validation.match',
  'winderfulApp.constants'
])
  .run(function($filter, $rootScope) {
    /**
     * Pretty-print watt
     * @param  {Integer} watts
     * @param  {Boolean} force a particular unit
     * @return {String} pretty-printed reading
     */
    $rootScope.watts = function(watt, hours = '', wrapUnits = true) {
      const unit = 'MW';
      let decimalPlaces = 2;

      if (watt > 1) {
        decimalPlaces = 0;
      }

      const cleanWatt = $filter('number')(watt, decimalPlaces);

      if (wrapUnits) {
        return `${cleanWatt}&nbsp;<span class="units">${unit}${hours}</span>`;
      } else {
        return `${cleanWatt} ${unit}${hours}`;
      }

    };
  })
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider
      .hashPrefix(false)
      .html5Mode(true);
  });
