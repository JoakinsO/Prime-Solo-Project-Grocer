myApp.service('GroceryListService', ['RecipeService', '$http', function(RecipeService, $http){
  var self = this;

  self.groceryList = new GroceryList();
  self.userList = {list: []};
  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = {list: []};
  self.refrigerator = {list: []};
  self.freezer = {list: []};
  self.pantry = {list: []};

  self.listToggle = false;

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

  self.createList = function() {
    let ingredients = self.groceryList.ingredientsFinal;
    let newList = {
      name: 'New List',
      ingredients,
    };

    $http.post('/groceryList', newList)
      .then( function(response){
        console.log(response);
        self.getUserList();
        self.clearRecipes();
      });
  };

  self.getUserList = function() {
    $http.get('/groceryList')
      .then( function(response){
        console.log(response.data);
        if(response.data.length > 0) {
          self.listToggle = true;
          self.userList.list = response.data[0].ingredients;

        }
      });
  };

  self.inCart = function(ingredient) {
    $http.put('/groceryList', ingredient)
      .then( function(response) {
        console.log(response);
      });
  };

  self.removeUserList = function() {
    $http.delete('/groceryList')
      .then( function(response) {
        console.log(response);
        console.log('list removed');
        self.getUserList();
        self.userList.list = [];
      });
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
