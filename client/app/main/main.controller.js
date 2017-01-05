'use strict';

(function() {
class MainController {

  constructor(appConfig, graphDefault, $filter, $http, $interval, $location, $timeout, $rootScope, $scope) {
    this.$filter = $filter;
    this.$http = $http;
    this.$interval = $interval;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.watts = $rootScope.watts;

    this.turbineAnimatedJS = false;

    this.loaded = false;

    this.currentOutput = {
      wind: 0
    };

    this.displayOutput = {
      wind: 0
    };

    this.turbineRotor = document.getElementById('turbine-rotor');
    this.turbineAngle = 0;
    this.turbineSpeed = 1;

    this.hoverDetails = {};
    this.iosSafari = /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
    this.graph = angular.copy(graphDefault);

    if (this.iosSafari) {
      const b = document.querySelector('body');
      b.classList.add('ios');
    }

    this.graph.features.hover.formatter = (series, x, y, z, a, b) => {
      // Rickshaw doesn't have a click event
      // temp store the details of where we hover in case the user clicks here
      this.hoverDetails.x = x;
      this.hoverDetails.y = y;
      this.hoverDetails.z = b.value.z;

      if (this.iosSafari) {
        // IOS not triggering ngclick for some reason on the graph, so temp fix
        this.updateStats();
        this.setHistoricStats();
        this.$scope.$apply();
      }

      // return format for hover tooltip on graph
      return y + 'MW';
    };

    this.absUrl = this.$location.protocol() + '://' + this.$location.host();

    this.randomStat = 1;
    this.appStats = appConfig.appStats;
  }

  $onInit() {
    const cachedCurrent = window.localStorage.getItem('current');
    const cachedHistorical = window.localStorage.getItem('historical');

    if (cachedCurrent) {
      this._updateCurrentData(JSON.parse(cachedCurrent));
    }

    if (cachedHistorical) {
      this._updateHistoricalData(JSON.parse(cachedHistorical));
    }

    this._getLatestData();
    this._getHistoricData();

    this.$interval(this._startStats.bind(this), 10000);
  }

  /**
   * Load the latest output data we have
   */
  _getLatestData() {
    this.$http({
      url: '/api/outputs/',
      params: {count: 1},
      method: 'GET'
    })
    .then(response => {
      this._updateCurrentData(response.data[0]);
      this._cacheData('current', response.data[0]);

    });
  }

  _cacheData(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  _getCurrentCached(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  _updateCurrentData(data) {
    this.currentOutput = angular.copy(data);
    this.displayOutput = angular.copy(data);

    this.turbineSpeed = this.powerToSpeed(this.displayOutput.wind);
  }

  /**
   * Load the historical data
   */
  _getHistoricData() {
    const url = `/api/outputs/`;

    return this.$http.get(url)
            .then(res => {
              this._updateHistoricalData(res.data);
              this._cacheData('historical', res.data);
            });
  }

  _toLocalTime(itemDate) {
    const dateFormat = 'YYYY,MM,D,HH,mm,ss';
    const date = moment(itemDate).format(dateFormat);
    const dateArr = date.split(',');
    dateArr[1] -= 1;
    const utcDate = moment.utc(dateArr);

    return utcDate.local();
  }

  _updateHistoricalData(data) {
    const mapped = data.map(item => {
      const localDate = this._toLocalTime(item.datetime);

      return {
        x: localDate.unix(),
        y: item.wind,
        z: item.demand
      };
    });

    this.graph.series[0].data = mapped.reverse();
    this.loaded = true;
  }

  _startStats() {
    this.randomStat = Math.round(Math.random() * (this.appStats.length - 1));
  }

  powerToSpeed(output) {
    if (!output) {
      return 1;
    }

    return output / 1000;
  }

  outputPower() {
    if (!this.displayOutput.wind) {
      return 0;
    }

    const percentage = this.displayOutput.wind / 7000;

    const sizedPercentage = Math.max(0.3, Math.min(percentage, 1));

    return sizedPercentage;
  }

  renderWindOutput() {
    return this.watts(this.displayOutput.wind, '', false);
  }

  renderDemand() {
    const percentage = 100 * this.displayOutput.wind / this.displayOutput.demand;
    const decimals = percentage > 1 ? 0 : 1;
    return this.$filter('number')(percentage, decimals) + '%';
  }

  renderDemandCopy() {
    const now = new Date();
    const displayDate = new Date(this._toLocalTime(this.displayOutput.datetime))
    const delta = 1000 * 5 * 60;
    let when = 'current';

    if (now - displayDate > delta) {
      when = '';
    }
    return `of the UK's ${when} electricity demand`;
  }

  updateStats(date, power, demand) {
    this.displayOutput.wind = power;
    this.displayOutput.datetime = new Date(date * 1000);
    this.displayOutput.demand = demand;

    this.turbineSpeed = this.powerToSpeed(this.displayOutput.wind);
  }

  startTurbineAnimation() {
    this.turbineRotor.classList.add('data-has-loaded');
    this.turbineAnimate();
  }

  turbineAnimate() {
    let newAngle = this.turbineAngle + this.turbineSpeed;

    if (newAngle > 359) {
      newAngle = newAngle % 360;
    }

    this.turbineRotor.style.transform = `rotate3d(0, 0, 1, ${newAngle}deg)`;
    this.turbineAngle = newAngle;

    window.requestAnimationFrame(this.turbineAnimate.bind(this));
  }

  statsRightNowCopy() {
    if (!this.displayOutput.datetime) {
      return '';
    }

    const now = new Date();
    const displayDate = new Date(this._toLocalTime(this.displayOutput.datetime))
    const delta = 1000 * 5 * 60;
    let when = 'Right now';
    let isWas = 'is';

    if (now - displayDate > delta) {
      when = this._toLocalTime(this.displayOutput.datetime).calendar(null, {
              sameDay: '[Today <span class="small">at] HH:mm[</span>]',
              nextDay: '[Tomorrow <span class="small">at] HH:mm[</span>]',
              nextWeek: 'dddd [<span class="small">at] HH:mm[</span>]',
              lastDay: '[Yesterday <span class="small">at] HH:mm[</span>]',
              lastWeek: '[On] dddd [<span class="small">at] HH:mm[</span>]',
              sameElse: 'L'
            });

      isWas = 'was';
    }

    return `${when}<br class="hide-not-xs"/> wind power ${isWas} `;
  }

  setHistoricStats() {
    if (!this.turbineAnimatedJS) {
      this.turbineAnimatedJS = true;
      this.startTurbineAnimation();
    }
    this.updateStats(this.hoverDetails.x, this.hoverDetails.y, this.hoverDetails.z);
  }

  globalSocialSharingMessage() {
    const cleanTotal = this.watts(this.currentOutput.wind, 'W', '', false);

    return `Wind energy is currently producing ${cleanTotal}`;
  }

  getStatExample(indexToShow = this.randomStat) {
    return this.appStats[indexToShow];
  }

  getStatExampleCopy(html = false, output = this.displayOutput, indexToShow = this.randomStat) {
    const stat = this.appStats[indexToShow];

    let message = '';

    if (typeof(html) === 'undefined') {
      html = false;
    }

    message += ' ' + stat.pre + ' ' || ' ';

    if (stat.consumption) {
      const howMany = output.wind / stat.consumption;
      let decimals = 0;

      if (howMany < 2) {
        decimals = 1;
      }

      message += html ? '<span class="large-copy">' : ' ';
      message +=  this.$filter('number')(howMany, decimals);
      message += stat.unit || '';
      message += html ? '</span>&nbsp;' : ' ';
    }

    message += stat.post ? stat.post : '';

    if (html && stat.extra) {
      message += '<span class="hide-xs">';
      message += ' ' + stat.extra;
      message += '</span>&nbsp;';
    }

    return message;
  }

  getSocialCopy() {
    let message = [
      'Right now wind is producing ',
      Math.round(100 * (this.currentOutput.wind / this.currentOutput.demand)),
      '%',
      ' of UK electricity - ',
      this.getStatExampleCopy(false, this.currentOutput)
    ];

    return message.join('');
  }
}

angular.module('winderfulApp')
  .controller('mainController', MainController);
})();
