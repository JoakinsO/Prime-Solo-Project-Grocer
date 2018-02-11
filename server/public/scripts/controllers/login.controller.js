myApp.controller('LoginController', ['$http', '$location', 'UserService', function($http, $location, UserService) {
    console.log('LoginController created');
    var self = this;
    self.user = {
      username: '',
      password: ''
    };
    self.message = UserService.message;

    self.login = function (userCreds) {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      } else {
        UserService.login(self.user);
      }
    };

    self.registerUser = function () {
      if (self.user.username === '' || self.user.password === '') {
        self.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', self.user);
        $http.post('/api/user/register', self.user).then(function (response) {
          console.log('success');
          $location.path('/home');
        },
          function (response) {
            console.log('error');
            self.message = "Something went wrong. Please try again.";
          });
      }
    };
}]);
