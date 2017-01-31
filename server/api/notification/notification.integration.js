'use strict';

var app = require('../..');
import request from 'supertest';

var newNotification;

describe('Notification API:', function() {

  describe('GET /api/notifications', function() {
    var notifications;

    beforeEach(function(done) {
      request(app)
        .get('/api/notifications')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          notifications = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      notifications.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/notifications', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/notifications')
        .send({
          name: 'New Notification',
          info: 'This is the brand new notification!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newNotification = res.body;
          done();
        });
    });

    it('should respond with the newly created notification', function() {
      newNotification.name.should.equal('New Notification');
      newNotification.info.should.equal('This is the brand new notification!!!');
    });

  });

  describe('GET /api/notifications/:id', function() {
    var notification;

    beforeEach(function(done) {
      request(app)
        .get('/api/notifications/' + newNotification._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          notification = res.body;
          done();
        });
    });

    afterEach(function() {
      notification = {};
    });

    it('should respond with the requested notification', function() {
      notification.name.should.equal('New Notification');
      notification.info.should.equal('This is the brand new notification!!!');
    });

  });

  describe('PUT /api/notifications/:id', function() {
    var updatedNotification;

    beforeEach(function(done) {
      request(app)
        .put('/api/notifications/' + newNotification._id)
        .send({
          name: 'Updated Notification',
          info: 'This is the updated notification!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedNotification = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedNotification = {};
    });

    it('should respond with the updated notification', function() {
      updatedNotification.name.should.equal('Updated Notification');
      updatedNotification.info.should.equal('This is the updated notification!!!');
    });

  });

  describe('DELETE /api/notifications/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/notifications/' + newNotification._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when notification does not exist', function(done) {
      request(app)
        .delete('/api/notifications/' + newNotification._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
