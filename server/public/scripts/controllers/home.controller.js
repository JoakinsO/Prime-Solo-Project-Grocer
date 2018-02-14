myApp.controller('HomeController', ['RecipeService', 'LoginService', function(RecipeService, LoginService){
  console.log('HomeController created');
  var self = this;

  self.userRecipes = RecipeService.userRecipes;

  self.removeRecipe = function(recipe) {
    RecipeService.removeRecipe(recipe);
  };

  self.logout = function() {
    LoginService.logout();
  };

}]);
