myApp.controller('GroceryListController', ['RecipeService', function(RecipeService) {
  console.log('GroceryListController created');
  var self = this;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = [];
  self.ingredients = [];
  self.refrigerator = [];
  self.freezer = [];
  self.pantry = [];

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
    let sortedFreezerNoDuplicates = removeDups(sortedIngredients.freezer, 'ingredientName');
    let sortedPantryNoDuplicates = removeDups(sortedIngredients.pantry, 'ingredientName');
    // console.log('Fridge no duplicates', sortedFridgeNoDuplicates);

    let sortedFridgeByIngName = sortByProp(sortedIngredients.refrigerator, sortedFridgeNoDuplicates, 'ingredientName');
    let sortedFreezerByIngName = sortByProp(sortedIngredients.freezer, sortedFreezerNoDuplicates, 'ingredientName');
    let sortedPantryByIngName = sortByProp(sortedIngredients.pantry, sortedPantryNoDuplicates, 'ingredientName');
    // console.log('ingredients sorted by name', sortedFridgeByIngName);

    let fridgeMeasurementsNoDuplicates= getMeasurements(sortedFridgeByIngName);
    let freezerMeasurementsNoDuplicates= getMeasurements(sortedFreezerByIngName);
    let pantryMeasurementsNoDuplicates= getMeasurements(sortedPantryByIngName);
    // console.log('Measurement sort ',fridgeMeasurementsNoDuplicates);

    let fridgeQuantities = calculateQuantities(fridgeMeasurementsNoDuplicates.sortedMeasurements, fridgeMeasurementsNoDuplicates.noDuplicates);
    let freezerQuantities = calculateQuantities(freezerMeasurementsNoDuplicates.sortedMeasurements, freezerMeasurementsNoDuplicates.noDuplicates);
    let pantryQuantities = calculateQuantities(pantryMeasurementsNoDuplicates.sortedMeasurements, pantryMeasurementsNoDuplicates.noDuplicates);
    self.refrigerator = fridgeQuantities;
    self.freezer = freezerQuantities;
    self.pantry = pantryQuantities;
    console.log('fridge ', self.refrigerator);
    console.log(self.freezer);
    console.log(self.pantry);


    let fridgeQtyNoDups = removeDups(fridgeQuantities, 'ingredientName');
    console.log(fridgeQtyNoDups);
    let sortFridgeQty = sortByProp(fridgeQuantities, fridgeQtyNoDups, 'ingredientName');
    // console.log(sortFridgeQty[0].length);
    for (let i = 0; i < sortFridgeQty.length; i++) {
      addQuantities(sortFridgeQty[i]);
    }

    console.log(sortFridgeQty);

  };

  // Sorts ingredients into 3 categories
  // begin sortCategories()
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
  } // end sortCategories()

  // removes duplicates from an array of objects based on the property passed in
  // begin removeDups()
  function removeDups(arr, prop) {
      return arr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
  } // end removeDups()

  // takes in two arrays, a master array, and an array with no duplicate objects
  // and sorts like objects into their own array based on the property passed in
  // begin sortByProp()
  function sortByProp(originalArray, noDuplicates, property) {
    let sortedArray = [];
    for (let i = 0; i < noDuplicates.length; i++) {
      sortedArray.push(originalArray.filter((item) => item[property] == noDuplicates[i][property]));
    }
    return sortedArray;
  } // end sortByProp()

  // takes in an array of ingredients and sorts them by like measurements
  // begin getMeasurements()
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
    // addQuantities(sortedMeasurements);

    let sorted = {
      sortedMeasurements: unNestArray(sortedMeasurements),
      noDuplicates: unNestArray(noDuplicates)
    };

    return sorted;
  } // end getMeasurements()

  // takes in a master array of ingredients and an array with no duplicate objects
  // and adds like ingredient measurements
  // begin calculateQuantities()
  function calculateQuantities(originalArray, noDuplicates) {
    let arrayCopy = [];
    // console.log(noDuplicates);
    // console.log(originalArray);

    for (var i = 0; i < noDuplicates.length; i++) {
      arrayCopy.push(Object.assign({}, noDuplicates[i]));
      let newQuantity = originalArray[i].reduce((x, y) => ({quantity: x.quantity + y.quantity}));
      arrayCopy[i].quantity = newQuantity.quantity;
    }
    return arrayCopy;
  } // end calculateQuantities()

  //
  function addQuantities(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].measurement == 'tsp' || array[i].measurement == 'tsp-fl') {
        tspToTbsp(array[i]);
      } else if (array[i].measurement == 'tbsp') {
        tbspToCup(array[i]);
      } else if (array[i].measurement == 'cup-fl') {
        cupToFlOz(array[i]);
      } else if (array[i].measurement == 'oz') {
        ozToLbs(array[i]);
      }
    }
  }

  function tspToTbsp(ingredient) {
    if (ingredient.measurement == 'tsp-fl') {
      if (ingredient.quantity % 3 == 0) {
        ingredient.quantity = ingredient.quantity / 3;
        ingredient.measurement = 'tbsp-fl';
      }
    } else if (ingredient.quantity % 3 == 0) {
      ingredient.quantity = ingredient.quantity / 3;
      ingredient.measurement = 'tbsp';
    }
  }

  function tbspToCup(ingredient) {
    if (ingredient.quantity % 4 == 0) {
      ingredient.quantity = ingredient.quantity / 16;
      ingredient.measurement = 'cup';
    }
  }

  function cupToFlOz(ingredient) {
    if (ingredient.quantity >= 1) {
      ingredient.quantity *= 8;
      ingredient.measurement = 'fl-oz';
    }
  }

  function ozToLbs(ingredient) {
    if (ingredient.quantity >= 16) {
      ingredient.quantity /= 16;
      ingredient.measurement = 'lbs';
    }
  }
  // takes in an array and reduces the nesting level by one
  // begin unNestArray()
  function unNestArray(array) {
    let unNestedArray = [];
    for (var i = 0; i < array.length; i++) {
      array[i].forEach(item => unNestedArray.push(item));
    }
    return unNestedArray;
  } // end unNestArray()

}]);
