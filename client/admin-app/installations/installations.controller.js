'use strict';
(function() {

class InstallationsComponent {
  constructor(FileUploader, Notification, $cookies, $http) {
    this.FileUploader = FileUploader;
    this.Notification = Notification;
    this.$cookies = $cookies;
    this.$http = $http;
    this.installations = [];
  }

  $onInit() {
    this.getInstallations();

    this.upload = new this.FileUploader({
          url: '/api/installations/',
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('token'),
            'x-xsrf-token': this.$cookies.get('XSRF-TOKEN')
          },
          queueLimit: 1,
          filters: [{
            name: 'csvFilter',
            fn: (item) => {
              // user can only upload CSV files
              var allowed = item.type === 'text/csv';

              if (!allowed) {
                this.Notification.error('Must select a CSV file.');
              }

              return allowed;
            }
          }],

          onSuccessItem: () => {
            this.Notification.success('Uploaded and inserted data successfully');
            this.getInstallations();
          },

          onErrorItem: () => {
            this.Notification.error('There was an error processing the data.');
          },

          onCompleteAll: function() {
            this.clearQueue();
          }
        });
  }

  getInstallations() {
    this.$http.get('/api/installations/full').then(response => {
      this.installations = response.data;
    });
  }

  deleteInstallation(id) {
    this.$http.delete(`/api/installations/${id}`).then(response => {
      this.Notification.success('Deleted successfully');
      this.getInstallations();
      $('#deleteModal').modal('hide');
    });
  }
}

angular.module('winderfulAppAdmin')
  .component('installations', {
    templateUrl: 'admin-app/installations/installations.html',
    controller: InstallationsComponent,
    controllerAs: '$data'
  });

})();
