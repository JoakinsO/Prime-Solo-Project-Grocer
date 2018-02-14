myApp.service('RecipeService', ['$http', '$location', function($http, $location){
  console.log('RecipeService Loaded');
  var self = this;

  self.ingredients = {list:[]};
  self.recipeInfo = {};
  self.userRecipes = {list:[]};

  self.createRecipe = function(recipeName, ingredients) {

    let config = {recipeName,};

  $http.post('/recipes', config)
      .then(function(response){
        console.log('recipe added: ', response.data);
        self.recipeInfo = response.data;
        ingredientObjects(ingredients);
        $location.path('/ingredients');
      })
      .catch(function(error){
        console.log('Error on POST: ',error);
      });
  };

  self.sendIngredients = function(ingredientsInfo) {
    $http.put('/recipes', ingredientsInfo)
        .then(function(response){
          console.log('Added Ingredients', response);
          self.getRecipesFromUser();
          $location.path('/home');
        })
        .catch(function(error){
          console.log('Error adding ingredients ', error);
        });
  };

  function ingredientObjects (ingredients) {
    let newIngredientList = [];
    for (var i = 0; i < ingredients.length; i++) {
      newIngredientList.push(new Ingredient(ingredients[i]));
    }
    self.ingredients.list = newIngredientList;
  }

  class Ingredient {
    constructor(name) {
      this.ingredientName = name;
    }
  }

  self.getRecipesFromUser = function() {
    $http.get('/recipes')
      .then(function(results) {
        console.log('recipes :', results.data);
        self.userRecipes.list = results.data;
      })
      .catch(function(error) {
        console.log('Error getting recipes', error);
      });
  };

  self.removeRecipe = function(recipe) {
    console.log(recipe._id);
    $http.delete(`/recipes/${recipe._id}`)
      .then(function(response){
        console.log('removed recipe:', response);
        self.getRecipesFromUser();
      })
      .catch(function(error){
        console.log('error removing recipe:', error);
      });
  };

  self.getRecipesFromUser();

}]);
