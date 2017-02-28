/**
 * Using Rails-like standard naming convention for endpoints.
 * GET    /api/notifications:id           ->  index
 * POST    /api/notifications:id           ->  create
 * DELETE  /api/notifications/:id          ->  destroy
 */

'use strict';

import request from 'request-promise';

import config from '../../config/environment';
import { Tweets, Notification } from '../../sqldb';
import Util from '../../util';

// Gets last tweeted message
// Keeps the messages and tweets in sync
export function index(req, res) {
  const redisKey = 'last-tweet';

  return Util.getCache(redisKey)
    .then(getLatestTweet(redisKey))
    .then(Util.respondWithResult(res))
    .catch(Util.handleError(res));
}

function getLatestTweet(redisKey) {
  return function(cached) {
    if (cached) {
      return JSON.parse(cached);
    }

    return Tweets.findAll({
        attributes: ['message'],
        limit: 1,
        order: [
          ['_id', 'DESC']
        ]
      })
      .then(Util.cacheResponse(redisKey, 3600));
  }
}


function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Creates a new Notification in the DB
export function create(req, res) {
  return Notification.create({
      gcmId: req.params.id
    })
    .then(Util.respondWithResult(res, 201))
    .catch(Util.handleError(res));
}

// Deletes a Notification from the DB
export function destroy(req, res) {
  return Notification.find({
      where: {
        gcmId: req.params.id
      }
    })
    .then(Util.handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(Util.handleError(res));
}

function buildRegistrationIDArray(ids) {
  const gcmIds = ids.map(item => {
    return item.gcmId;
  });

  return gcmIds;
}

function sendNotifications(ids) {
  const timeToLive = 1 * 3600; // 3 hours

  const options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    body: {
      /*jshint camelcase: false */
      // time to live is set to 1h
      registration_ids: ids,
      time_to_live: timeToLive
      /*jshint camelcase: true */
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + config.notifications.authorization
    },
    json: true
  };

  return request(options)
    .then(function(body) {
      console.log('good!', JSON.stringify(body));
    })
    .catch(function(err) {
      console.log('bad!', JSON.stringify(err));
    });
}

/**
 * Send notification to our group of users
 */
export function sendToGroup() {
  return Notification.findAll()
    .then(buildRegistrationIDArray)
    .then(sendNotifications)

  return false;
}
