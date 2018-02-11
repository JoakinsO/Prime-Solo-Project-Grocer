myApp.service('RecipeService', ['$http', '$location', function($http, $location){
  console.log('RecipeService Loaded');
  var self = this;

  self.ingredients = [];

  self.createRecipe = function(recipeName, ingredients) {
    self.ingredients = ingredients;

    console.log(recipeName, self.ingredients);

    let config = {recipeName,};

    console.log(config);

    $http.post('/recipes', config)
      .then(function(response){
        console.log('recipe added: ', response);
        $location.path('/ingredients');
      })
      .catch(function(error){
        console.log('Error on POST: ',error);
      });
  };
}]);
