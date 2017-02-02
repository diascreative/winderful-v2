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
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  '720kb.socialshare',
  'angular-rickshaw',
  'validation.match',
  'winderfulApp.constants'
])
  .run(function($cookies, $filter, $rootScope) {
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

    if ('Notification' in window && Notification.permission !== 'granted') {
      const firstVisit = $cookies.getObject('firstVisit');
      const now = new Date().getTime();

      if (firstVisit === 'blocked') {
        return;
      }

      if (!firstVisit) {
        $cookies.putObject('firstVisit', now);
      } else if (now - firstVisit > 3600 * 5) {
        window.subscribePush();
      }
    }
  })
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider
      .hashPrefix(false)
      .html5Mode(true);
  });
