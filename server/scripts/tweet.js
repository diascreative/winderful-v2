'use strict';

import schedule from 'node-schedule';
import Twitter from 'twitter';

import * as Notifications from '../api/notification/notification.controller';
import {Output, Tweets} from '../sqldb';
import config from '../config/environment';

module.exports = {
  scheduleJobs: scheduleJobs
};

const mileStones = [10, 12, 15, 18, 20, 22, 24, 25];
/* TODO: use their social url */
const socialUrl = 'http://winderfuluk.org/winddial';

function scheduleJobs() {
  // tweetScript();
  // import data every hour
  schedule.scheduleJob('0 * * * *', tweetScript);
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

function checkData(responses) {
  const data = responses[0];
  const tweet = responses[1];
  const storedIndex = responses[2].equivalentIndex;

  const windOutput = data.wind;
  const percentageOfDemand = Math.round((data.wind / data.demand) * 100);

  if ((!tweet || tweet.percentage < percentageOfDemand) &&
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

    const stat = config.appStats[newIndex];
    const message = config.appStatsCopy(tweet, stat) + ` ${socialUrl} #BlownAway`;
    storeAsLastTweet(tweet.percentage, newIndex, message);

    console.log(message);

    /*jshint camelcase: false */
    const client = new Twitter({
      consumer_key: config.twitter.TWITTER_CONSUMER_KEY,
      consumer_secret: config.twitter.TWITTER_CONSUMER_SECRET,
      access_token_key: config.twitter.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: config.twitter.TWITTER_ACCESS_TOKEN_SECRET
    });
    /*jshint camelcase: true */

    client.post('statuses/update', { status: message }, function(error, tweets) {
      if (!error) {
        console.log(tweets);
      } else {
        console.log('error tweeting');
      }
    });

    Notifications.sendToGroup();

    return true;
  }

  return false;
}
