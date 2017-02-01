(function(angular, undefined) {
'use strict';

angular.module('winderfulApp.constants')
  .constant('graphDefault', {
      features: {
        hover: {
          xFormatter: function(x) {
            const time = moment.unix(x).format('LLL');

            return time;
          }
        },
        xAxis: {
          timeUnit: {
            'name': '12 hour',
            'seconds': 3600 * 24,
            'formatter': function(d) {
              var day = moment(d).format('D');
              var num = day.charAt(day.length - 1);
              var ordinal = 'th';

              if (num === '1' && day !== '11') {
                ordinal = 'st';
              } else if (num === '2' && day !== '12') {
                ordinal = 'nd';
              } else if (num === '3' && day !== '13') {
                ordinal = 'rd';
              }

              return moment(d).format('D') + ordinal;
            }
          }
        }
      },
      options: {
        renderer: 'area',
        height: (window.innerWidth >= 675 ? 194 : 110)
      },
      series: [{
        name: 'Wind Generation',
        color: '#417505',
        data: [{x: 0, y: 0}]
      }]
    });
})(angular);
