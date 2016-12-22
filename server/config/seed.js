/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Output from '../sqldb';

Output.sync()
  .then(() => {
    return Output.destroy({ where: {} });
  })
  .then(() => {
    Output.bulkCreate([{
      datetime: '2016-04-22 12:15:00',
      demand: 35754,
      wind: 1579
    }, {
      datetime: '2016-04-22 12:00:00',
      demand: 35749,
      wind: 1588
    }]);
  });
