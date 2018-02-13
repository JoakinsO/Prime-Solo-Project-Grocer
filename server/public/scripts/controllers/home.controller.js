myApp.controller('HomeController', ['RecipeService', function(RecipeService){
  console.log('HomeController created');
  var self = this;
  self.userRecipes = RecipeService.userRecipes;

  self.getRecipes = function() {
    RecipeService.getRecipesFromUser();
  };

  self.getRecipes();

  self.removeRecipe = function(recipe) {
    console.log(recipe);
  };


}]);
