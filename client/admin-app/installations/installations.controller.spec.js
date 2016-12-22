'use strict';

describe('Component: InstallationsComponent', function () {

  // load the controller's module
  beforeEach(module('winderfulAppAdmin'));

  var InstallationsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    InstallationsComponent = $componentController('InstallationsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
