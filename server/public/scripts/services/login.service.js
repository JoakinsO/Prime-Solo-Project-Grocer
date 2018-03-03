myApp.service('LoginService', ['$http', '$location', function($http, $location){
  console.log('LoginService Loaded');
  var self = this;
  self.userObject = {};

  self.message = '';

  self.login = function (userCreds) {
      $http.post('/api/user/login', userCreds).then(
        function (response) {
          if (response.status == 200) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/home');
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
      $http.post('/api/user/register', newUserCreds).then(function (response) {
        swal('Success!', 'Please use your newly created credentials to log in!');
        console.log('success');
      },
        function (response) {
          console.log('error');
          self.message = "Something went wrong. Please try again.";
        });
  };

  self.getuser = function(){
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userData = response.data._id;
            console.log('LoginService -- getuser -- User Data: ', self.userObject.userName);
        } else {
            console.log('LoginService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/login");
        }
    },function(response){
      console.log('LoginService -- getuser -- failure: ', response);
      $location.path("/login");
    });
  };

  self.logout = function() {
    $http.get('/api/user/logout').then(function(response) {
      console.log('LoginService -- logout -- logged out');
      $location.path("/login");
    });
  };
}]);
