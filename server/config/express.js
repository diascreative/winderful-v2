/**
 * Express configuration
 */

'use strict';

import helmet from 'helmet';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
// import passport from 'passport';
import session from 'express-session';
import sqldb from '../sqldb';
import Util from '../util';
import expressSequelizeSession from 'express-sequelize-session';
var Store = expressSequelizeSession(session.Store);

export default function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.set('appPath', path.join(config.root, 'client'));

  app.get('/', function(req, res) {
    return getLatest()
        .then(renderIndex(req, res));
  });

  app.get('/index.html', function(req, res) {
    return getLatest()
        .then(renderIndex(req, res));
  });

  function getLatest() {
    const redisKey = `gen--index--latest`;

    return Util.getCache(redisKey)
      .then(getLatestOutput(redisKey));
  }

  function getLatestOutput(redisKey) {
    return function(cached) {
      if (cached) {
        return JSON.parse(cached);
      }

      return sqldb.Output.findOne({
        attributes: ['demand', 'wind', 'datetime'],
        order: [['datetime', 'DESC']]
        })
        .then(Util.cacheResponse(redisKey));
    }
  }

  function renderIndex(req, res) {
    return function(data) {
      // build the Root URL of the project
      let protocol = req.protocol;

      if (config.env === 'production') {
        // force https on production
        protocol = 'https';
      }
      const rootUrl = protocol + '://' + req.get('host');
      const embedded = req.query.embedded === 'true';
      const bgColor = req.query.bgColor || false;

      res.render(path.resolve(app.get('appPath') + '/index.html'), {
        windOutput: data.wind,
        demand: data.demand,
        rootUrl: rootUrl,
        animationDuration: powerToSpeed(data.wind),
        heartSize: outputPower(data.wind),
        embedded: embedded,
        bgColor: bgColor
      });
    }
  }

  function powerToSpeed(output) {
    // on the client side, the angle changes by
    // output / 1000
    // 60 times a second (fps)
    // lets say output is 3774
    // 60fps * (3774 / 1000) = 62.9deg/s
    // .: 360 / 62.9 = 5.723370429 seconds to complete 1 rotation /360deg)

    if (!output) {
      return 22;
    }

    return 360 / (60 * (output / 1000));
  }


  function outputPower(output) {
    if (!output) {
      return 0;
    }

    const percentage = output / 7000;
    const sizedPercentage = Math.max(0.3, Math.min(percentage, 1));

    return sizedPercentage;
  }

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    app.use(express.static(app.get('appPath') + '/admin-app'));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(require('connect-livereload')());
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
