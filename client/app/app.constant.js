(function(angular, undefined) {
'use strict';

angular.module('winderfulApp.constants')
  .constant('graphDefault', {
      features: {
        hover: {
          xFormatter: function(x) {
            const time = moment.unix(x).utc().format('HH:mm, Do MMM YYYY');
            // 20:13, JAN, 02, 2017

            return time;
          }
        },
        xAxis: {
          timeUnit: {
            'name': '24 hour',
            'seconds': 3600 * 24,
            'formatter': function(d) {
              return moment(d).utc().format('Do');
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
