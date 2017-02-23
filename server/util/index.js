'use strict';

const bluebird = require('bluebird');
import config from '../config/environment';
import redisClient from '../redis';

const Util = {
  respondWithResult,
  handleEntityNotFound,
  handleError,
  getCache,
  cacheResponse,
  clearCacheItem,
  clearCache
};

module.exports = Util;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity = {}) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err = '') {
    res.status(statusCode).send(err);
  };
}

/**
 * Check if we have cached an API response
 * @param  {String} redisKey
 * @return {Promise}
 */
function getCache(redisKey) {
  if (!config.redis.enabled) {
    return bluebird.delay(1);
  }

  return redisClient.getAsync(`${config.redis.key}::${redisKey}`)
}

/**
 * Cache an API response
 * @param  {String} redisKey
 * @param  {Number}  cacheExpiry
 * @return {Array} Respose
 */
function cacheResponse(redisKey=false, cacheExpiry=300) {
  return function(entity) {
    if (redisKey && entity) {
      redisClient.set(`${config.redis.key}::${redisKey}`, JSON.stringify(entity));
      redisClient.expire(`${config.redis.key}::${redisKey}`, cacheExpiry);
    }

    return entity;
  }
}

function clearCacheItem(redisKey=false) {
  redisClient.del(`${config.redis.key}::${redisKey}`);
}

function clearCache() {
  return function() {
    return redisClient.keys('*', function(err, replies) {
      replies.forEach(function(val) {
        if (val.indexOf(config.redis.key) > -1) {
          redisClient.del(val);
        }
      });
    });
  }
}
