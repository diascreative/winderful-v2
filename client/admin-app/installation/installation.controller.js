'use strict';
(function() {

class InstallationComponent {
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;

    this.details = {};
    this.id = this.$state.params.id;
  }

  $onInit() {
    const url = `/api/installations/${this.id}/full`;

    this.$http.get(url).then(response => {
      this.installation = response.data;
    });
  }
}

angular.module('winderfulAppAdmin')
  .component('installation', {
    templateUrl: 'admin-app/installation/installation.html',
    controller: InstallationComponent,
    controllerAs: 'vm'
  });

})();
