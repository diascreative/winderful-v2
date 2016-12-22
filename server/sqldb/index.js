/**
 * Sequelize initialization module
 */

'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.database,
                           config.sequelize.username,
                           config.sequelize.password,
                           config.sequelize.options)
};

// Insert models below
db.Tweets = db.sequelize.import('../api/tweets/tweets.model');
db.Output = db.sequelize.import('../api/output/output.model');

// Insert associations below

module.exports = db;
