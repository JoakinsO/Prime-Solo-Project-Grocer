myApp.controller('LoginController', ['$http', '$location', 'LoginService', '$mdDialog', function($http, $location, LoginService, $mdDialog) {
    // console.log('LoginController created');
    var self = this;

    self.user = {
      username: '',
      password: ''
    };

    self.loginAlert = LoginService.loginAlert;

    self.login = function (userCreds) {
      if (self.user.username === '' || self.user.password === '') {
        swal('Please try again!', 'You have entered an invalid username or password.');
      } else {
        LoginService.login(userCreds);
        // console.log(self.loginAlert);
      }
    };

    self.registerDialog = function (ev) {
      $mdDialog.show({
          controller: RegisterDialogController,
          controllerAs: 'vm',
          templateUrl: '../views/partials/register.partial.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function (answer) {
          // console.log(answer);
          LoginService.registerUser(answer);
        }, function () {
          self.status = 'You cancelled the dialog.';
          // console.log(self.status);
        });
    };

    function RegisterDialogController($mdDialog) {
      const self = this;

      self.registerAlert = false;

      self.hide = function () {
        $mdDialog.hide();
      };

      self.cancel = function () {
        $mdDialog.cancel();
      };

      self.answer = function (answer) {
        if(answer != undefined) {
          if (answer.username === '' || answer.password === '' ||
          answer.password == undefined || answer.username == undefined ) {
            self.registerAlert = true;
          } else {
            $mdDialog.hide(answer);
            self.registerAlert = false;
          }
        } else {
          self.registerAlert = true;
        }
      };
    }
}]);
