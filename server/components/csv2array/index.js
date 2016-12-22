'use strict';

var _ = require('lodash');

exports.parse = csv2array;

function csv2array(csv) {
  var csvRows = csv.split('\n');
  var rows = _.tail(csvRows)
              .map(row2Array);

  return rows;
}

function row2Array(row) {
  var text = row.replace(/\s\s+/gi, '');
  var reValid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  var reValue = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  // Return NULL if input string is not well formed CSV string.
  if (!reValid.test(text)) {
    return null;
  }

  var a = [];                     // Initialize array to receive values.
  text.replace(reValue, // "Walk" the string using replace with callback.
    function(m0, m1, m2, m3) {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) {
        a.push(m1.replace(/\\'/g, '\''));
      }

      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) {
        a.push(m2.replace(/\\"/g, '"'));
      } else if (m3 !== undefined) {
        a.push(m3);
      }

      return ''; // Return empty string.
    });

  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) {
    a.push('');
  }

  return a;
}
