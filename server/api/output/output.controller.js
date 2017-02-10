/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/outputs              ->  index
 */

'use strict';

import {Output, sequelize} from '../../sqldb';
import Util from '../../util';

// Gets a list of Outputs
export function index(req, res) {
  const queryString = JSON.stringify(req.query);
  const redisKey = `gen--index--${queryString}`;

  return Util.getCache(redisKey)
    .then(query(redisKey, req))
    .then(Util.handleEntityNotFound(res))
    .then(Util.respondWithResult(res))
    .catch(Util.handleError(res));
}

/**
 * DB query to get the latest output data
 * @param  {String} redisKey if we do a DB query, we'll cache the response
 * @req
 */
function query(redisKey, req) {
  return function(cached) {
    if (cached) {
      return JSON.parse(cached);
    }

    const whereQuery = {};
    const count = req.query.count ? parseInt(req.query.count) : 2000;
    let groupTime = '%Y%m%d%H%i'; // average per hour

    if (!req.query.count) {
      let timeFrame = 6;

      if (req.query.range === 'month') {
        timeFrame = 31;
        groupTime = '%Y%m%d%H'; // average per hour
      } else if (req.query.range === 'year') {
        timeFrame = 365;
        groupTime = '%Y%m%d'; // average per day
      }

      const dateRange = new Date();
      dateRange.setDate(dateRange.getDate() - timeFrame);

      whereQuery.datetime = {
        $gt: dateRange
      }
    }

    return Output.findAll({
        attributes: [
          [sequelize.fn('min', sequelize.col('datetime')), 'datetime'],
          [sequelize.fn('date_format', sequelize.col('datetime'), groupTime), 'date_col_formed'],
          [sequelize.fn('avg', sequelize.col('demand')), 'demand'],
          [sequelize.fn('avg', sequelize.col('wind')), 'wind']
        ],
        limit: count,
        where: whereQuery,
        group: [
          'date_col_formed'
        ],
        order: 'datetime DESC'
      })
      .then(Util.cacheResponse(redisKey));
  }
}
