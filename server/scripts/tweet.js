'use strict';

import schedule from 'node-schedule';
import Twitter from 'twitter';

import config from '../config/environment';
import * as Notifications from '../api/notification/notification.controller';
import { Output, Tweets, sequelize } from '../sqldb';
import Util from '../util';


module.exports = {
  scheduleJobs: scheduleJobs
};

const mileStones = [10, 12, 15, 18, 20, 22, 24, 25, 30, 35];
const socialUrl = 'http://bit.ly/winderful';

function scheduleJobs() {
  // tweet every hour
  schedule.scheduleJob('2 * * * *', tweetScript);

  // tweet about the maximum % covered at night
  schedule.scheduleJob('0 9 * * *', nightTweet);
}

/**
 * Check if the % demand went over 10% during the night
 * and send tweets/notifications is it has
 *
 * @returns {Promise}
 */
function nightTweet() {
  return Promise.all([getNightMax(), getLastTweet(), getLastTweetMessageIndex()])
    .then(checkNightData)
    .then(tweet(true));
}

/**
 * Check if the current % demand has met one of our milestones for the today
 * and send tweets/notifications is it has
 *
 * @returns {Promise}
 */
function tweetScript() {
  return Promise.all([getLatest(), getLastTweet(), getLastTweetMessageIndex()])
    .then(checkData)
    .then(tweet());
}

/**
 * Get the biggest % we have sent messages for today
 *
 * @returns
 */
function getLastTweet() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Tweets.findOne({
    attributes: ['percentage', 'createdAt'],
    where: {
      createdAt: {
        $gt: today
      }
    },
    order: [['createdAt', 'DESC']]
    });
}

/**
 * Get the current output
 *
 * @returns
 */
function getLatest() {
  return Output.findOne({
    attributes: ['demand', 'wind', 'datetime'],
    order: [['datetime', 'DESC']]
    });
}

/**
 * Get the equivalentIndex of the last message sent
 *
 * @returns
 */
function getLastTweetMessageIndex() {
  return Tweets.findOne({
    attributes: ['equivalentIndex'],
    order: [['createdAt', 'DESC']]
    });
}

/**
 * Store message sent out to people
 *
 * @param {any} percentage
 * @param {any} index
 * @param {any} message
 * @returns
 */
function storeAsLastTweet(percentage, index, message) {
  return Tweets.create({
      percentage: percentage,
      equivalentIndex: index,
      message: message
    });
}

/**
 * Check to see if the current % should be notified
 *
 * @param {any} [currentOutput, lastTeet, lastTweetIndex]
 * @returns
 */
function checkData([currentOutput, lastTweet, lastTweetIndex]) {
  const storedIndex = lastTweetIndex ? lastTweetIndex.equivalentIndex : -1;
  const windOutput = currentOutput.wind;
  const percentageOfDemand = Math.round((currentOutput.wind / currentOutput.demand) * 100);

  // current wind production should hit a milestone
  // it should also be the largest demand that has hit a milestone today
  if ((!lastTweet || lastTweet.percentage < percentageOfDemand) &&
      mileStones.indexOf(percentageOfDemand) > -1) {

    return {
      prevIndex: storedIndex,
      wind: windOutput,
      percentage: percentageOfDemand
    };
  }

  console.log(`Do not tweet about ${percentageOfDemand}%`);

  return false;
}

/**
 * Get the maximum % demand during the night
 *
 * @returns
 */
function getNightMax() {
  const midnight = new Date();
  const morning = new Date();
  midnight.setHours(0, 0, 0, 0);
  morning.setHours(9, 0, 0, 0);

  return Output.findAll({
    attributes: [
      [sequelize.fn('floor', sequelize.literal('(100*wind/demand)')), 'percentage']
    ],
    where: {
      datetime: {
        $lt: morning,
        $gt: midnight
      }
    },
    limit: 1,
    order: 'percentage DESC'
  });
}

/**
 * Check if the night data meets the criteria to notify users about
 *
 * @param {any} [maxOutput, lastTeet, lastTweetIndex]
 * @returns
 */
function checkNightData([maxOutput, lastTeet, lastTweetIndex]) {
  // we decrement the equivalent index to not lose our current position in the custom posts
  const storedIndex = lastTweetIndex ? lastTweetIndex.equivalentIndex - 1 : -1;
  const maxPercentage = maxOutput[0].dataValues.percentage;

  if (maxPercentage > 10) {
    return {
      prevIndex: storedIndex,
      percentage: maxPercentage
    };
  }

  return false;
}

/**
 * Send out our tweets and notifications
 *
 * @param {boolean} [nightMessage=false]
 * @returns
 */
function tweet(nightMessage = false) {
  return function(tweet = false) {
    if (tweet) {
      let newIndex = tweet.prevIndex + 1;

      if (newIndex >= config.appStats.length) {
        newIndex = 0;
      }

      // TODO: custom messages for tweets
      // const stat = config.appStats[newIndex];
      // const message = config.appStatsCopy(tweet, stat) + ` ${socialUrl} #wind`;
      const message = nightMessage ?
        `While you were sleeping, #windenergy reached ${tweet.percentage}% of the ` +
        `National Grid's electricity demand. ${socialUrl}` :
        `Right now #wind is meeting ${tweet.percentage}% of the ` +
        `National Grid's electricity demand. ${socialUrl}`;

      storeAsLastTweet(tweet.percentage, newIndex, message);
      Util.clearCacheItem('last-tweet');

      if (config.twitter.TWITTER_CONSUMER_KEY) {
        /*jshint camelcase: false */
        const twitterClient = new Twitter({
          consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
          consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
          access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
          access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET
        });
        /*jshint camelcase: true */

        twitterClient.post('statuses/update', { status: message }, function(error, tweets) {
          if (!error) {
            console.log(tweets);
          } else {
            console.log('error tweeting');
          }
        });
      }

      if (config.notifications.authorization) {
        Notifications.sendToGroup();
      }

      return true;
    }

    return false;
  }
}
