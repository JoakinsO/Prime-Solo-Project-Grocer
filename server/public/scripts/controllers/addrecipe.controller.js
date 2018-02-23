myApp.controller('AddRecipeController', [ 'RecipeService', 'LoginService', function(RecipeService, LoginService) {
  console.log('AddRecipeController created');
  var self = this;

  self.ingredients = [];

  self.createRecipe = function(recipeName, ingredients) {
    RecipeService.createRecipe(recipeName, ingredients);
  };

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };


}]);
