myApp.controller('GroceryListController', ['RecipeService', 'LoginService', function(RecipeService, LoginService) {
  console.log('GroceryListController created');
  var self = this;

  self.recipeList = RecipeService.userRecipes;
  self.addedRecipes = [];
  self.ingredients = [];
  self.refrigerator = [];
  self.freezer = [];
  self.pantry = [];

  RecipeService.getRecipesFromUser();

  self.logout = function() {
    LoginService.logout();
    RecipeService.userRecipes.list = [];
  };

  self.clearRecipes = function() {
    self.ingredients.length = 0;
    self.refrigerator.length = 0;
    self.freezer.length = 0;
    self.pantry.length = 0;
    self.addedRecipes.length = 0;
  };

  self.addRecipesToList = function(recipe) {
    console.log(recipe);
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

    // console.log('fridge ', self.refrigerator);
    // console.log(self.freezer);
    // console.log(self.pantry);

    let fridgeQtyNoDups = removeDups(fridgeQuantities, 'ingredientName');
    let freezerQtyNoDups = removeDups(freezerQuantities, 'ingredientName');
    let pantryQtyNoDups = removeDups(pantryQuantities, 'ingredientName');

    let sortFridgeQty = sortByProp(fridgeQuantities, fridgeQtyNoDups, 'ingredientName');
    let sortFreezerQty = sortByProp(freezerQuantities, freezerQtyNoDups, 'ingredientName');
    let sortPantryQty = sortByProp(pantryQuantities, pantryQtyNoDups, 'ingredientName');

    addQuantities(sortFridgeQty);
    addQuantities(sortFreezerQty);
    addQuantities(sortPantryQty);

    let finalFridgeMeasurements = getMeasurements(sortFridgeQty);
    let finalFreezereMeasurements = getMeasurements(sortFreezerQty);
    let finalPantryMeasurements = getMeasurements(sortPantryQty);



    console.log('sort fridge', sortFridgeQty);
    let finalFridge = calculateQuantities(finalFridgeMeasurements.sortedMeasurements, finalFridgeMeasurements.noDuplicates);
    let finalFreezer = calculateQuantities(finalFreezereMeasurements.sortedMeasurements, finalFreezereMeasurements.noDuplicates);
    let finalPantry = calculateQuantities(finalPantryMeasurements.sortedMeasurements, finalPantryMeasurements.noDuplicates);
    console.log(finalFridge);

    fractionizer(finalFridge);
    fractionizer(finalFreezer);
    fractionizer(finalPantry);

    self.refrigerator = finalFridge;
    self.freezer = finalFreezer;
    self.pantry = finalPantry;

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
    // console.log(sorted);

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
    // console.log('array copy',arrayCopy);
    return arrayCopy;
  } // end calculateQuantities()

  function addQuantities(array) {
    for (let i = 0; i < array.length; i++) {
      addQuantitiesSingleArray(array[i]);
    }
  }

  // begin addQuantities()
  function addQuantitiesSingleArray(array) {
    if ( array.find((elem) => elem.measurement == 'lbs') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length < 2) {
          if (Qty(array[i].measurement).isCompatible('lbs')) {
            let newQuantity = Qty(array[i].quantity, array[i].measurement).to('lbs');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'lbs';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'floz') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length == 2) {
          if (Qty(array[i].measurement).isCompatible('floz')) {
            let newQuantity = Qty(array[i].quantity, newMeasurement[0]).to('floz');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'floz';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'cup') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length < 2) {
          if (Qty(array[i].measurement).isCompatible('cup')) {
            let newQuantity = Qty(array[i].quantity, array[i].measurement).to('cup');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'cup';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'cup-fl') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length == 2) {
          if (Qty(newMeasurement[0]).isCompatible('cup')) {
            let newQuantity = Qty(array[i].quantity, newMeasurement[0]).to('cup');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'cup-fl';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'tbsp') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length < 2) {
          if (Qty(array[i].measurement).isCompatible('tbsp')) {
            let newQuantity = Qty(array[i].quantity, array[i].measurement).to('tbsp');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'tbsp';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'tbsp-fl') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length == 2) {
          if (Qty(newMeasurement[0]).isCompatible('tbsp')) {
            let newQuantity = Qty(array[i].quantity, newMeasurement[0]).to('tbsp');
            array[i].quantity = newQuantity.scalar;
            array[i].measurement = 'tbsp-fl';
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'tsp') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        if (array[i].measurement.split('-').length < 2) {
          if (Qty(array[i].measurement).isCompatible('tbsp')) {
            if (array[i].quantity >= 3) {
              let newQuantity = Qty(array[i].quantity, array[i].measurement).to('tbsp');
              array[i].quantity = newQuantity.scalar;
              array[i].measurement = 'tbsp';
            }
          }
        }
      }
    } else if ( array.find((elem) => elem.measurement == 'tsp-fl') != undefined) {
      for (let i = 0; i < array.length; i++) {
        let newMeasurement = array[i].measurement.split('-');
        console.log(newMeasurement);
        if (array[i].measurement.split('-').length == 2) {
          if (Qty(newMeasurement[0]).isCompatible('tbsp')) {
            if (array[i].quantity >= 3) {
              let newQuantity = Qty(array[i].quantity, newMeasurement[0]).to('tbsp');
              array[i].quantity = newQuantity.scalar;
              array[i].measurement = 'tbsp-fl';
            }
          }
        }
      }
    }
  } // end addQuantities()


  function fractionizer(array) {
    console.log('in fractionizer()', array);
    for (var i = 0; i < array.length; i++) {
      if (array[i].quantity < 1) {
        if (array[i].quantity > 0.75) {
          array[i].quantity = Math.ceil(array[i].quantity);
        } else if (array[i].quantity <= 0.75 && array[i].quantity > 0.50) {
          array[i].quantity = '3/4';
        } else if (array[i].quantity <= 0.50 && array[i].quantity > 0.33) {
          array[i].quantity = '1/2';
        } else if (array[i].quantity <= 0.33 && array[i].quantity > 0.25) {
          array[i].quantity = '1/3';
        } else if (array[i].quantity <= 0.25) {
          array[i].quantity = '1/4';
        }
      } else if (array[i].quantity >= 1) {
        if (array[i].quantity % 1 != 0) {
          if ((array[i].quantity % 1) > 0.75) {
            array[i].quantity = Math.ceil(array[i].quantity);
          } else if (array[i].quantity % 1 <= 0.75 && array[i].quantity % 1 > 0.50) {
            array[i].quantity = Math.floor(array[i].quantity);
            array[i].quantity += ' 3/4';
          } else if (array[i].quantity % 1 <= 0.50 && array[i].quantity % 1 > 0.33) {
            array[i].quantity = Math.floor(array[i].quantity);
            array[i].quantity += ' 1/2';
          } else if (array[i].quantity % 1 <= 0.33 && array[i].quantity % 1 > 0.25) {
            array[i].quantity = Math.floor(array[i].quantity);
            array[i].quantity += ' 1/3';
          } else if (array[i].quantity % 1 <= 0.25) {
            array[i].quantity = Math.floor(array[i].quantity);
            array[i].quantity += ' 1/4';
          }
        }
      }
    }
  }

}]);
