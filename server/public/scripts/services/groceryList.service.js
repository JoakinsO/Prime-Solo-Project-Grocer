myApp.service('GroceryListService', ['RecipeService', function(RecipeService){
  var self = this;

  self.groceryList = new GroceryList();
  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = {list: []};
  self.refrigerator = {list: []};
  self.freezer = {list: []};
  self.pantry = {list: []};

  RecipeService.getRecipesFromUser();

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.clearRecipes = function() {
    self.refrigerator.list = [];
    self.freezer.list = [];
    self.pantry.list = [];
    self.addedRecipes.list = [];
    self.groceryList.clearGroceryList();
  };



  self.addRecipesToList = function(recipe) {
    self.refrigerator.list = [];
    self.freezer.list  = [];
    self.pantry.list  = [];

    self.groceryList.addedRecipesList(recipe.recipeName);
    self.groceryList.addIngredientsToMaster(recipe.ingredients);
    self.groceryList.doList();

    sortIngredients(self.groceryList.ingredientsFinal);

    self.addedRecipes.list = self.groceryList.addedRecipes;
  };

  function sortIngredients(ingredientArray) {
    for (let ingredient of ingredientArray) {
      if(ingredient.category == 'Refrigerator') {
        self.refrigerator.list.push(ingredient);
      } else if (ingredient.category == 'Freezer') {
        self.freezer.list.push(ingredient);
      } else if (ingredient.category == 'Pantry') {
        self.pantry.list.push(ingredient);
      }
    }
  }

}]);
