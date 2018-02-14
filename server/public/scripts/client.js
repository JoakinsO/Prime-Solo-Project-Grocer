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
    .when('/home', {
      templateUrl: '/views/templates/home.view.html',
      controller: 'HomeController as vm',
      resolve: {
        getuser : function(LoginService){
          return LoginService.getuser();
        }
      }
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
    .when('/groceryList', {
      templateUrl: '/views/templates/grocerylist.view.html',
      controller: 'GroceryListController as vm',
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
