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
    // extra bits won't always fit in tweets
    // message += stat.extra ? ' ' + stat.extra : '';

    return message;
  },
appStats: [
    {
      consumption: (0.000483 * 26400000) / 100,
      pre: `that's enough to power`,
      post: `of UK homes!`,
      extra: `Staying in tonight?`,
      unit: '%'
    },
    {
      consumption: 1050 / 1000000,
      pre: `that's enough to run`,
      post: `loads of washing.`,
      extra: `It's laundry time!`
    },
    {
      consumption: 1800 / 1000000,
      pre: `that's enough for`,
      post: `kettles!`,
      extra: `Anyone for a cuppa?`
    },
    {
      consumption: 1200 / 1000000,
      pre: `that's enough to power`,
      post: `toasters!`,
      extra: `Afternoon snack time?`
    },
    {
      consumption: 115 / 1000000,
      pre: `that's enough for`,
      post: `LED TVs!`,
      extra: `Movie marathon, anyone?`
    },
    {
      consumption: 45 / 1000000,
      pre: `that's enough to power`,
      post: `PS4s!`,
      extra: `Boredom: cured.`
    },
    {
      consumption: 1000 / 1000000,
      pre: `that's enough for`,
      post: `blowdryers!`,
      extra: `Treat yo'self.`
    },
    {
      consumption: 5 / 1000000,
      pre: `that's enough for`,
      post: `bike lights.`,
      extra: `Road safety first!`
    },
    {
      consumption: 1000 / 1000000,
      pre: `that's enough to power`,
      post: `hob cookers!`,
      extra: `Hungry?`
    },
    {
      consumption: 1000 / 1000000,
      pre: `that's enough to power`,
      post: `hob cookers!`,
      extra: `Dinner party?`
    },
    {
      consumption: 5 / 1000000,
      pre: `that's enough to charge`,
      post: `smartphones.`,
      extra: `That's a lot of phone calls`
    },
    {
      consumption: 5 / 1000000,
      pre: `that's enough to charge`,
      post: `smartphones!`,
      extra: `Just one more round of Pokemon Go wouldn't hurt… right? Right?`
    },
    {
      consumption: 20.83 / 1000000,
      pre: `that's enough to power`,
      post: `freezers.`,
      extra: `Time to stock up on ice cream`
    }
  ]
};
