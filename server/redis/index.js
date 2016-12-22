'use strict';

var redis = require('redis');
var bluebird = require('bluebird');
var client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('connect', function() {
  console.log('Redis connected');
});

client.on('error', function(err) {
  console.log('Redis error' + err);
});

module.exports = client;
