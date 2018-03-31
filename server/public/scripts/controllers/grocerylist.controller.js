myApp.controller('GroceryListController', ['RecipeService', 'LoginService', function(RecipeService, LoginService) {
  // console.log('GroceryListController created');
  var self = this;
  self.groceryList = new GroceryList();
  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = [];
  self.ingredients = [];
  self.refrigerator = [];
  self.freezer = [];
  self.pantry = [];

  console.log(self.recipeList);
  RecipeService.getRecipesFromUser();

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.clearRecipes = function() {
    self.ingredients.length = 0;
    self.refrigerator.length = 0;
    self.freezer.length = 0;
    self.pantry.length = 0;
    self.addedRecipes.length = 0;
  };



  self.addRecipesToList = function(recipe) {

    self.refrigerator = [];
    self.freezer = [];
    self.pantry = [];

    self.groceryList.addedRecipesList(recipe.recipeName);

    self.groceryList.addIngredientsToMaster(recipe.ingredients);

    self.groceryList.doList();
    console.log(self.groceryList.ingredientsFinal);
    sortIngredients(self.groceryList.ingredientsFinal);

  };

  function sortIngredients(ingredientArray) {
    console.log('in sort', ingredientArray);
    for (let ingredient of ingredientArray) {
      if(ingredient.category == 'Refrigerator') {
        self.refrigerator.push(ingredient);
      } else if (ingredient.category == 'Freezer') {
        self.freezer.push(ingredient);
      } else if (ingredient.category == 'Pantry') {
        self.pantry.push(ingredient);
      }
    }
  }


}]);
