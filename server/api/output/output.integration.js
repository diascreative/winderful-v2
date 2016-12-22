'use strict';

var app = require('../..');
import request from 'supertest';

var newOutput;

describe('Output API:', function() {

  describe('GET /api/outputs', function() {
    var outputs;

    beforeEach(function(done) {
      request(app)
        .get('/api/outputs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          outputs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      outputs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/outputs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/outputs')
        .send({
          name: 'New Output',
          info: 'This is the brand new output!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOutput = res.body;
          done();
        });
    });

    it('should respond with the newly created output', function() {
      newOutput.name.should.equal('New Output');
      newOutput.info.should.equal('This is the brand new output!!!');
    });

  });

  describe('GET /api/outputs/:id', function() {
    var output;

    beforeEach(function(done) {
      request(app)
        .get('/api/outputs/' + newOutput._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          output = res.body;
          done();
        });
    });

    afterEach(function() {
      output = {};
    });

    it('should respond with the requested output', function() {
      output.name.should.equal('New Output');
      output.info.should.equal('This is the brand new output!!!');
    });

  });

  describe('PUT /api/outputs/:id', function() {
    var updatedOutput;

    beforeEach(function(done) {
      request(app)
        .put('/api/outputs/' + newOutput._id)
        .send({
          name: 'Updated Output',
          info: 'This is the updated output!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOutput = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOutput = {};
    });

    it('should respond with the updated output', function() {
      updatedOutput.name.should.equal('Updated Output');
      updatedOutput.info.should.equal('This is the updated output!!!');
    });

  });

  describe('DELETE /api/outputs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/outputs/' + newOutput._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when output does not exist', function(done) {
      request(app)
        .delete('/api/outputs/' + newOutput._id)
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
