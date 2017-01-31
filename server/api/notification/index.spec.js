'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var notificationCtrlStub = {
  index: 'notificationCtrl.index',
  show: 'notificationCtrl.show',
  create: 'notificationCtrl.create',
  update: 'notificationCtrl.update',
  destroy: 'notificationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var notificationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './notification.controller': notificationCtrlStub
});

describe('Notification API Router:', function() {

  it('should return an express router instance', function() {
    notificationIndex.should.equal(routerStub);
  });

  describe('GET /api/notifications', function() {

    it('should route to notification.controller.index', function() {
      routerStub.get
        .withArgs('/', 'notificationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/notifications/:id', function() {

    it('should route to notification.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'notificationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/notifications', function() {

    it('should route to notification.controller.create', function() {
      routerStub.post
        .withArgs('/', 'notificationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/notifications/:id', function() {

    it('should route to notification.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'notificationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/notifications/:id', function() {

    it('should route to notification.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'notificationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/notifications/:id', function() {

    it('should route to notification.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'notificationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
