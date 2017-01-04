/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/outputs              ->  index
 */

'use strict';

import {Output} from '../../sqldb';
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
    const count = req.query.count ? parseInt(req.query.count) : 1000;

    if (!req.query.count) {
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

      whereQuery.datetime = {
        $gt: sixDaysAgo
      }
    }

    return Output.findAll({
        attributes: ['demand', 'wind', 'datetime'],
        limit: count,
        where: whereQuery,
        order: [['datetime', 'DESC']]
      })
      .then(Util.cacheResponse(redisKey));
  }
}
