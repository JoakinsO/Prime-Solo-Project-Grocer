myApp.controller('HomeController', ['RecipeService', 'LoginService','$anchorScroll', function(RecipeService, LoginService, $anchorScroll){
  console.log('HomeController created');
  var self = this;

  self.userRecipes = RecipeService.userRecipes;

  RecipeService.getRecipesFromUser();

  self.singleRecipe = {};

  self.recipeClicked = false;

  self.removeRecipe = function(recipe) {
    RecipeService.removeRecipe(recipe);
  };

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.viewRecipe = function(recipe) {
    self.singleRecipe = recipe;
    fractionizer(self.singleRecipe.ingredients);
    self.recipeClicked = !self.recipeClicked;
    $anchorScroll();
  };

  self.editRecipe = function(recipe) {
    RecipeService.editRecipe(recipe);
  };

}]);
