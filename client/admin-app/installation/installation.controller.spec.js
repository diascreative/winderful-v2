'use strict';

describe('Component: InstallationComponent', function () {

  // load the controller's module
  beforeEach(module('winderfulAppAdmin'));

  var InstallationComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    InstallationComponent = $componentController('InstallationComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
