myApp.controller('IngredientsController', ['RecipeService', function(RecipeService) {
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
    self.ingredients.list.push(new RecipeService.IngredientClass(''));
  };

  self.removeIngredient = function(ingredientIndex) {
    console.log(ingredientIndex);
    self.ingredients.list.splice(ingredientIndex, 1);
  };
}]);
