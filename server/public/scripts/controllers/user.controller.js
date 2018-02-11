myApp.controller('UserController', ['LoginService', function(LoginService) {
  console.log('UserController created');
  var self = this;
  self.userService = LoginService;
  self.userObject = LoginService.userObject;
}]);
