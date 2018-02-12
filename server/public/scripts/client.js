var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', '$mdIconProvider', function($routeProvider, $locationProvider, $mdIconProvider) {
  console.log('myApp -- config');

  $mdIconProvider
  .icon('md-close', 'img/icons/ic_close_24px.svg', 24);

  $routeProvider
    .when('/', {
      redirectTo: 'login'
    })
    .when('/login', {
      templateUrl: '/views/templates/login.view.html',
      controller: 'LoginController as vm',
    })
    .when('/addRecipe', {
      templateUrl: '/views/templates/addRecipe.view.html',
      controller: 'AddRecipeController as vm',
      resolve: {
        getuser : function(LoginService){
          return LoginService.getuser();
        }
      }
    })
    .when('/ingredients', {
      templateUrl: '/views/templates/ingredients.view.html',
      controller: 'IngredientsController as vm',
      resolve: {
        getuser : function(LoginService){
          return LoginService.getuser();
        }
      }
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as vm',
      resolve: {
        getuser : function(LoginService){
          return LoginService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController as vm',
      resolve: {
        getuser : function(LoginService){
          return LoginService.getuser();
        }
      }
    })
    .otherwise({
      template: '<h1>404</h1>'
    });
}]);
