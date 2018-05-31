myApp.service('LoginService', ['$http', '$location', function($http, $location){
  // console.log('LoginService Loaded');
  var self = this;
  self.userObject = {};

  self.loginAlert = '';

  self.login = function (userCreds) {
      $http.post('/api/user/login', userCreds).then(
        function (response) {
          if (response.status == 200) {
            // console.log('success: ', response.data);
            $location.path('/home');
          } else {
            swal('Please try again!', 'You have entered an invalid username or password.');
            console.log('failure error: ', response);

          }
        },
        function (response) {
          swal('Please try again!', 'You have entered an invalid username or password.');
          console.log('failure error: ', response);
        });
  };

  self.registerUser = function (newUserCreds) {
      $http.post('/api/user/register', newUserCreds).then(function (response) {
        swal('Success!', 'Use your new credentials to log in!');
        // console.log('success');
      },
        function (response) {
          console.log('error', response);
        });
  };

  self.getuser = function(){
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userData = response.data._id;
            // console.log('LoginService -- getuser -- User Data: ', self.userObject.userName);
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
      // console.log('LoginService -- logout -- logged out');
      $location.path("/login");
    });
  };
}]);
