myApp.controller('GroceryListController', ['GroceryListService', 'RecipeService', 'LoginService', function(GroceryListService, RecipeService, LoginService) {

  var self = this;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = GroceryListService.addedRecipes;
  self.refrigerator = GroceryListService.refrigerator;
  self.freezer = GroceryListService.freezer;
  self.pantry = GroceryListService.pantry;

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.clearRecipes = function() {
    GroceryListService.clearRecipes();
  };

  self.addRecipesToList = function(recipe) {
    GroceryListService.addRecipesToList(recipe);
  };

  self.createList = function() {
    GroceryListService.createList();
  };

}]);
