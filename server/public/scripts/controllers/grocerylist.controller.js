myApp.controller('GroceryListController', ['GroceryListService', 'RecipeService', 'LoginService', function(GroceryListService, RecipeService, LoginService) {

  var self = this;

  self.userList = GroceryListService.userList;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = GroceryListService.addedRecipes;
  self.refrigerator = GroceryListService.refrigerator;
  self.freezer = GroceryListService.freezer;
  self.pantry = GroceryListService.pantry;

  self.toggleUserList = false;

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

  GroceryListService.getUserList();

  self.inCart = function(ingredient) {
    ingredient.purchased = !ingredient.purchased;
    GroceryListService.inCart(ingredient);
  };

  self.removeUserList = function() {
    GroceryListService.removeUserList();

  };

}]);
