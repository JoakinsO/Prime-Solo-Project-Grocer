myApp.controller('AddRecipeController', [ 'RecipeService', function(RecipeService) {
  console.log('AddRecipeController created');
  var self = this;

  self.ingredients = [];

  self.createRecipe = function(recipeName, ingredients) {
    RecipeService.createRecipe(recipeName, ingredients);
  };


}]);
