'use strict';

import BMReports from './import.bm-reports';
import Tweets from './tweet';

module.exports = scheduleCrons;

function scheduleCrons() {
  BMReports.scheduleJobs();
  // Tweets.scheduleJobs();
}
