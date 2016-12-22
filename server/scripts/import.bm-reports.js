'use strict';

import request from 'request-promise';
import schedule from 'node-schedule';

import {Output} from '../sqldb';
import config from '../config/environment';

const API_KEY = config.bmreports.key;

module.exports = {
  scheduleJobs: scheduleJobs
};

function scheduleJobs() {
  // import data every 5 mins
  schedule.scheduleJob('6,11,16,21,26,31,36,41,46,51,56 * * * *', importData);
}

function importData() {
  console.log('Start importing data', new Date());

  return Promise.all([
      getWind(),
      getDemand(),
      getPv()
    ])
    .then(parseData)
    .then(storeData)
    .catch(handleError);
}

function getWind() {
  const url = `https://api.bmreports.com/BMRS/FUELINSTHHCUR/V1?APIKey=${API_KEY}&FuelType=WIND&ServiceType=csv`;

  const options = {
    method: 'GET',
    uri: url
  };

  return request(options);
}

function getDemand() {
  const url = `https://api.bmreports.com/BMRS/ROLSYSDEM/V1?APIKey=${API_KEY}&FuelType=WIND&ServiceType=csv`;

  const options = {
    method: 'GET',
    uri: url
  };

  return request(options);
}

function getPv() {
  const options = {
      uri: 'http://pvlive@ssfdb3.shef.ac.uk:8080/crud/nationalgrid/pvnowcast/0',
      json: true
  };

  return request(options);
}

function parseData(requests) {
  const readingWind = parseWind(requests[0]);
  const [readingDemand, readingDatetime] = parseDemand(requests[1]);
  const pvDetails = requests[2];

  const entry = {
    wind: readingWind,
    demand: readingDemand,
    datetime: readingDatetime,
    pv: pvDetails.generation_MW
  };

  return entry;
}

function parseWind(data) {
  let reading = 0;
  let headless = data.split('\n');

  // remove dirty head
  headless.shift();

  // remove dirty tail
  headless.pop();

  // remove dirty TOTAL
  headless.pop();

  headless.forEach(row => {
    const splitRow = row.split(',');

    if (splitRow.length > 2 && splitRow[1] === 'WIND') {
      reading = splitRow[2];
    }
  });

  return reading;
}

function parseDemand(data) {
  let headless = data.split('\n');

  // remove dirty head
  headless.shift();

  // remove dirty tail
  headless.pop();

  const lastReading = headless.pop().split(',');

  const reading = lastReading[2];
  // 20161219110500
  // 2016-12-19 11:05:00
  const date = formatDate(lastReading[1]);


  return [reading, date];
}

function formatDate(date) {
  const m = date.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
}

function handleError(one) {
  console.error(one)
}

function storeData(entry) {
  return Output.create(entry);
}
