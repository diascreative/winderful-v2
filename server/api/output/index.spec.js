'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var outputCtrlStub = {
  index: 'outputCtrl.index'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var outputIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './output.controller': outputCtrlStub
});

describe('Output API Router:', function() {

  it('should return an express router instance', function() {
    outputIndex.should.equal(routerStub);
  });

  describe('GET /api/outputs', function() {

    it('should route to output.controller.index', function() {
      routerStub.get
        .withArgs('/', 'outputCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
