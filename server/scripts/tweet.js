'use strict';

import schedule from 'node-schedule';
import Twitter from 'twitter';

import config from '../config/environment';
import * as Notifications from '../api/notification/notification.controller';
import { Output, Tweets } from '../sqldb';
import Util from '../util';


module.exports = {
  scheduleJobs: scheduleJobs
};

const mileStones = [10, 12, 15, 18, 20, 22, 24, 25, 30, 35];
const socialUrl = 'http://bit.ly/winderful';

function scheduleJobs() {
  // tweet every hour
  schedule.scheduleJob('2 * * * *', tweetScript);
}

function tweetScript() {
  return Promise.all([getLatest(), getLastTweet(), getLastTweetMessageIndex()])
    .then(checkData)
    .then(tweet);
}

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

function getLatest() {
  return Output.findOne({
    attributes: ['demand', 'wind', 'datetime'],
    order: [['datetime', 'DESC']]
    });
}

function getLastTweetMessageIndex() {
  return Tweets.findOne({
    attributes: ['equivalentIndex'],
    order: [['createdAt', 'DESC']]
    });
}

function storeAsLastTweet(percentage, index, message) {
  return Tweets.create({
      percentage: percentage,
      equivalentIndex: index,
      message: message
    });
}

function checkData([currentOutput, lastTeet, lastTweetIndex]) {
  const storedIndex = lastTweetIndex ? lastTweetIndex.equivalentIndex : -1;
  const windOutput = currentOutput.wind;
  const percentageOfDemand = Math.round((currentOutput.wind / currentOutput.demand) * 100);

  if ((!lastTeet || lastTeet.percentage < percentageOfDemand) &&
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

function tweet(tweet = false) {
  if (tweet) {
    let newIndex = tweet.prevIndex + 1;

    if (newIndex >= config.appStats.length) {
      newIndex = 0;
    }

    // TODO: custom messages for tweets
    // const stat = config.appStats[newIndex];
    // const message = config.appStatsCopy(tweet, stat) + ` ${socialUrl} #wind`;
    const message = `Right now #wind is meeting ${tweet.percentage}% of the ` +
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
