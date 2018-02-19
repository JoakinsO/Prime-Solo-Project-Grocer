myApp.controller('GroceryListController', ['RecipeService', function(RecipeService) {
  console.log('GroceryListController created');
  var self = this;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = [];
  self.ingredients = [];
  self.refrigerator = [];

  self.addRecipesToList = function(recipe) {
    self.addedRecipes.push(recipe.recipeName);

    // adding ingredients to master list
    for (var i = 0; i < recipe.ingredients.length; i++) {
      self.ingredients.push(Object.assign({}, recipe.ingredients[i]));
    }
    // console.log('Original Array of ingredients', self.ingredients);

    let sortedIngredients = sortCategories(self.ingredients);
    // console.log('Sorted to categories(fridge)', sortedIngredients.refrigerator);

    let sortedFridgeNoDuplicates = removeDups(sortedIngredients.refrigerator, 'ingredientName');
    // console.log('Fridge no duplicates', sortedFridgeNoDuplicates);

    let sortedFridgeByIngName = sortByProp(sortedIngredients.refrigerator, sortedFridgeNoDuplicates, 'ingredientName');
    // console.log('ingredients sorted by name', sortedFridgeByIngName);

    let fridgeMeasurementsNoDuplicates= getMeasurements(sortedFridgeByIngName);
    // console.log('Measurement sort ',fridgeMeasurementsNoDuplicates);

    let fridgeQuantities = calculateQuantities(fridgeMeasurementsNoDuplicates.sortedMeasurements, fridgeMeasurementsNoDuplicates.noDuplicates);
    self.refrigerator = fridgeQuantities;
    console.log(self.refrigerator);

  };


  function calculateQuantities(originalArray, noDuplicates) {
    let arrayCopy = [];
    console.log(noDuplicates);
    console.log(originalArray);

    for (var i = 0; i < noDuplicates.length; i++) {
      arrayCopy.push(Object.assign({}, noDuplicates[i]));
      let newQuantity = originalArray[i].reduce((x, y) => ({quantity: x.quantity + y.quantity}));
      arrayCopy[i].quantity = newQuantity.quantity;
    }
    return arrayCopy;
  }


  // for (var i = 0; i < arr.length; i++) {
  //   for (var j = 0; j < arr[i].length; j++) {
  //     arr[i][j][0].quantity = arr[i][j].reduce((x, y) => ({quantity: x.quantity + y.quantity}));
  //     quantitiesNoDups.push();
  //   }
  // }


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

  function sortByProp(originalArray, noDuplicates, property) {
    let sortedArray = [];
    for (let i = 0; i < noDuplicates.length; i++) {
      sortedArray.push(originalArray.filter((item) => item[property] == noDuplicates[i][property]));
    }
    // console.log('split by name: ',sortedArray);
    return sortedArray;
  }

  function getMeasurements(originalArray) {
    let sortedMeasurements = [];
    let noDuplicates = [];

    for (let i = 0; i < originalArray.length; i++) {
      noDuplicates.push(removeDups(originalArray[i], 'measurement'));
      // console.log(originalArray[i]);
    }
    // console.log('in getMeasurements( originalArray)', originalArray);
    // console.log('in getMeasurements() noDups', noDuplicates);

    for (var i = 0; i < noDuplicates.length; i++) {
      sortedMeasurements.push(sortByProp(originalArray[i], noDuplicates[i], 'measurement'));
    }
    // console.log('Sorted by measurement', sortedMeasurements);
    let sorted = {
      sortedMeasurements: unNestArray(sortedMeasurements),
      noDuplicates: unNestArray(noDuplicates)
    };

    return sorted;
  }

  function unNestArray(array) {
    let unNestedArray = [];
    for (var i = 0; i < array.length; i++) {
      array[i].forEach(item => unNestedArray.push(item));
    }
    return unNestedArray;
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
