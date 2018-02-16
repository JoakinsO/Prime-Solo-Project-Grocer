myApp.controller('GroceryListController', ['RecipeService', function(RecipeService) {
  console.log('GroceryListController created');
  var self = this;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = [];
  self.ingredients = [];

  self.addRecipesToList = function(recipe) {
    let ingredientsArray = self.ingredients;
    self.addedRecipes.push(recipe.recipeName);

    // adding ingredients to master list
    for (var i = 0; i < recipe.ingredients.length; i++) {
      ingredientsArray.push(recipe.ingredients[i]);
    }
    // gives an array of each item in the master list, only once
    let dupsRemoved = removeDups(ingredientsArray, 'ingredientName');
    // console.log('Dups removed', dupsRemoved);

    // sorts the master list of ingredients by category.
    // object with properties .refrigerator, .freezer, .pantry
    let sortedIngredients = sortCategories(ingredientsArray);
    // console.log('sorted', sortedIngredients);

    // object with categories sorted into arrays and ingredients listed only once
    let sortedNoDups = {
      refrigerator : removeDups(sortedIngredients.refrigerator, 'ingredientName'),
      freezer : removeDups(sortedIngredients.freezer, 'ingredientName'),
      pantry : removeDups(sortedIngredients.pantry, 'ingredientName')
    };

    // console.log('sorted no dups', sortedNoDups);

    // Creates an array of arrays of objects which puts each ingredient in an array with like ingredient names
    let fridgeSort = sortByProp(sortedIngredients.refrigerator, sortedNoDups.refrigerator, 'ingredientName');
    // let freezerSort = sortByName(sortedIngredients.freezer, sortedNoDups.freezer);
    // let pantrySort = sortByName(sortedIngredients.pantry, sortedNoDups.pantry);

    // console.log('fridge ingredient sort',fridgeSort);
    // console.log(freezerSort);
    // console.log(pantrySort);

    let fridgeMeasurementSort = getMeasurements(fridgeSort);

    let fridgeCalc = calculateQuantities(fridgeMeasurementSort);

    // let fridgeMeasurementSort = sortByProp(fridgeSort, sortedNoDups.refrigerator, 'measurement');
    //
    // console.log('Fridge measurement sort', fridgeMeasurementSort);
  };

  function calculateQuantities(arr) {
    console.log('begin', arr);

    let quantitiesNoDups = [];

    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        arr[i][j][0].quantity = arr[i][j].reduce((x, y) => ({quantity: x.quantity + y.quantity}));
        quantitiesNoDups.push();
      }
    }
    console.log('quantitiesNoDups ',quantitiesNoDups);
  }

  function getMeasurements(array) {
    let noDups = [];
    let sortedMeasurements = [];
    //
    for (let i = 0; i < array.length; i++) {
      noDups.push(removeDups(array[i], 'measurement'));
    }

    console.log('in getMeasurements() noDups', noDups);

    for (var i = 0; i < noDups.length; i++) {
      sortedMeasurements.push(sortByProp(array[i], noDups[i], 'measurement'));
    }
    return sortedMeasurements;
  }

  function sortByProp(dups, noDups, prop) {
    let sortedArray = [];
    for (let i = 0; i < noDups.length; i++) {

      sortedArray.push(dups.filter((x) => x[prop] == noDups[i][prop]));
    }
    // console.log('split by name: ',sortedArray);
    return sortedArray;
  }

  function sortCategories(ingredientsArray) {
    let refrigerator = [];
    let freezer = [];
    let pantry = [];

    for (let i = 0; i < ingredientsArray.length; i++) {
      if(ingredientsArray[i].category == 'Refrigerator') {
        refrigerator.push(ingredientsArray[i]);
      }
      if(ingredientsArray[i].category == 'Freezer') {
        freezer.push(ingredientsArray[i]);
      }
      if(ingredientsArray[i].category == 'Pantry') {
        pantry.push(ingredientsArray[i]);
      }
    }

    let sorted = {
      refrigerator,
      freezer,
      pantry,
    };

    return sorted;
  }



  // removes duplicates from an array of objects
  function removeDups(arr, prop) {
      return arr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
  }

  // takes new array of unique elements and adds the quantity total of the matching items in the old array
  // function getIngTotals() {
  //
  //   let newArr = removeDups(a, 'name');
  //
  //   for (var i = 0; i < newArr.length; i++) {
  //     if(a.filter((x) => x.name == newArr[i].name).length > 1) {
  //       let newQuantity = a.filter((x) => x.name == newArr[i].name).reduce((x, y) => ({quantity: x.quantity + y.quantity}));
  //       newArr[i].quantity = newQuantity.quantity;
  //     }
  //   }
  //   return newArr;
  // }
  console.clear();





}]);
