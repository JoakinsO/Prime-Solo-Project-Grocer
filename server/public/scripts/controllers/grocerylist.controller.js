myApp.controller('GroceryListController', ['GroceryListService', 'RecipeService', 'LoginService', function(GroceryListService, RecipeService, LoginService) {

  var self = this;

  self.userList = GroceryListService.userList;

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

  GroceryListService.getUserList();

  self.inCart = function(ingredient) {
    // if (!ingredient.purchased) {
    //   ingredient.purchased = true;
    // } else {
    //   ingredient.purchased = false;
    // }

    ingredient.purchased = !ingredient.purchased;
    console.log(ingredient.purchased);
    GroceryListService.inCart(ingredient);
  };

}]);
