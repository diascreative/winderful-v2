'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sql: {
    dialect: 'mysql'
  },
  sequelize: {
    database: 'sunful-v2',
    username: 'root',
    password: '',
    options: {
      logging: true,
      timezone: '+00:00'
    }
  },
  redis: {
    enabled: false,
    key: 'winderful-development---'
  },

  twitter: {
    // TWITTER_CONSUMER_KEY: '',
    // TWITTER_CONSUMER_SECRET: '',
    // TWITTER_ACCESS_TOKEN_KEY: '',
    // TWITTER_ACCESS_TOKEN_SECRET: ''
  },
  bmreports: {
    key: ''
  },
  seedDB: false
};
