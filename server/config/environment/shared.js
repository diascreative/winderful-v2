'use strict';

exports = module.exports = {
  // List of user roles
  appStatsCopy: function(output, stat) {
    let message = `Right now wind is producing ${output.percentage}% of UK electricity -`;

    function formatNum(number, decimals, decPoint, thousandsSep) {
      var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
          dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
          toFixedFix = function(n, prec) {
              // Fix for IE parseFloat(0.55).toFixed(0) = 0;
              var k = Math.pow(10, prec);
              return Math.round(n * k) / k;
          },
          s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');

      if (s[0].length > 3) {
          s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }

      if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
      }

      return s.join(dec);
    }

    message += ' ' + stat.pre + ' ' || ' ';

    if (stat.consumption) {
      const howMany = output.wind / stat.consumption;
      let decimals = 0;

      if (howMany < 2) {
        decimals = 1;
      }

      message += formatNum(howMany, decimals);

      message += stat.unit || '';
      message += ' ';
    }

    message += stat.post ? stat.post : '';

    return message;
  },
appStats: [
    {
      consumption: (0.000483 * 26400000) / 100,
      pre: `That's enough to power`,
      post: `of UK homes!`,
      unit: '%'
    },
    {
      consumption: 1050 / 1000000,
      pre: `That's enough to run`,
      post: `loads of washing.`
    },
    {
      consumption: 1800 / 1000000,
      pre: `That's enough for`,
      post: `kettles!`
    },
    {
      consumption: 1200 / 1000000,
      pre: `That's enough to power`,
      post: `toasters!`
    },
    {
      consumption: 115 / 1000000,
      pre: `That's enough for`,
      post: `LED TVs!`
    },
    {
      consumption: 45 / 1000000,
      pre: `That's enough to power`,
      post: `PS4s!`
    },
    {
      consumption: 1000 / 1000000,
      pre: `That's enough for`,
      post: `blowdryers!`
    },
    {
      consumption: 5 / 1000000,
      pre: `That's enough for`,
      post: `bike lights.`
    },
    {
      consumption: 1000 / 1000000,
      pre: `That's enough to power`,
      post: `hob cookers!`
    },
    {
      consumption: 5 / 1000000,
      pre: `That's enough to charge`,
      post: `smartphones.`
    },
    {
      consumption: 20.83 / 1000000,
      pre: `That's enough to power`,
      post: `freezers.`
    }
  ]
};
