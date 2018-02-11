myApp.service('UserService', ['$http', '$location', function($http, $location){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  self.message = '';

  self.login = function (userCreds) {
      console.log('sending to server...', userCreds);
      $http.post('/api/user/login', userCreds).then(
        function (response) {
          if (response.status == 200) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/user');
          } else {
            console.log('failure error: ', response);
            self.message = "Incorrect credentials. Please try again.";
          }
        },
        function (response) {
          console.log('failure error: ', response);
          self.message = "Incorrect credentials. Please try again.";
        });
  };

  self.registerUser = function (newUserCreds) {
      console.log('sending to server...', newUserCreds);
      $http.post('/api/user/register', newUserCreds).then(function (response) {
        console.log('success');
        $location.path('/home');
      },
        function (response) {
          console.log('error');
          self.message = "Something went wrong. Please try again.";
        });
  };

  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  },

  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  };
}]);
