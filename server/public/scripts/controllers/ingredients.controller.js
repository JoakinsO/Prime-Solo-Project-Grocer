
myApp.controller('IngredientsController', ['RecipeService', 'LoginService', function(RecipeService, LoginService) {
  console.log('IngredientsController created');
  var self = this;

  self.ingredients = RecipeService.ingredients;
  self.recipeInfo = RecipeService.recipeInfo;

  console.log('recipe info', self.recipeInfo);

  self.addIngredients = function(ingredients) {
    let ingredientsToSend = {
      recipeId : self.recipeInfo._id,
      ingredients : ingredients.list
    };
    RecipeService.sendIngredients(ingredientsToSend);
  };

  self.addSingleIngredient = function() {
    self.ingredients.list.push(new Ingredient(''));
  };

  self.removeIngredient = function(ingredientIndex) {
    console.log(ingredientIndex);
    self.ingredients.list.splice(ingredientIndex, 1);
  };

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

}]);
