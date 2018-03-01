myApp.controller('HomeController', ['RecipeService', 'LoginService', '$mdDialog', function(RecipeService, LoginService, $mdDialog){
  console.log('HomeController created');
  var self = this;

  self.userRecipes = RecipeService.userRecipes;

  RecipeService.getRecipesFromUser();

  self.singleRecipe = {};



  self.removeRecipe = function(recipe) {
    RecipeService.removeRecipe(recipe);


  };

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.viewRecipe = function(recipe) {
    singleRecipe = recipe;
    self.recipeDialog(recipe);
  };

  self.editRecipe = function(recipe) {

    RecipeService.editRecipe(recipe);
  };

  self.recipeDialog = function (ev) {
    $mdDialog.show({
        controller: RecipeDialogController,
        controllerAs: 'vm',
        templateUrl: '../views/partials/viewRecipe.partial.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function (answer) {
        self.editRecipe(answer);
      }, function () {
        self.status = 'You cancelled the dialog.';
      });
  };

  function RecipeDialogController($mdDialog) {
    const self = this;
    self.singleRecipe = singleRecipe;
    self.registerAlert = false;

    self.hide = function () {
      $mdDialog.hide();
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  }



}]);
