class GroceryList {
  constructor() {
    this.addedRecipes = [];
    this.masterList = [];
    this.noDuplicates = [];
    this.nameSort = [];
    this.measurementSort = [];
    this.quantities = [];
    this.quantitiesNoDuplicates = [];
    this.quantitiesSorted = [];
    this.ingredientsFinal = [];
    this.pantry = [];
    this.freezer = [];
    this.refrigerator = [];
  }

  addedRecipesList(recipeName) {
    this.addedRecipes.push(recipeName);
  }

  addIngredientsToMaster(recipe) {
    for (let ingredient of recipe) {
      this.masterList.push(Object.assign({}, ingredient));
    }
  }

  doList() {
    this.sortListNoDuplicates();
    this.sortListbyIngredientName();
    this.sortIngredientsByMeasurement();
    this.getQuantities();
    this.getQuantitiesNoDuplicates();
    this.sortIngredientsQty();
    this.addIngreients();
    this.getSecondMeasurements();
    this.getFinalQuantities();
  }

  sortListNoDuplicates() {
    this.noDuplicates = removeDups(this.masterList, 'ingredientName');
  }

  sortListbyIngredientName() {
    this.nameSort = sortByProp(this.masterList, this.noDuplicates, 'ingredientName');
  }

  sortIngredientsByMeasurement() {
    this.measurementSort = this.getMeasurements(this.nameSort);
  }

  getQuantities() {
    this.quantities = this.calculateQuantities(this.measurementSort.measurements, this.measurementSort.noDuplicates);
  }

  getQuantitiesNoDuplicates() {
    this.quantitiesNoDuplicates = removeDups(this.quantities, 'ingredientName');
  }

  sortIngredientsQty() {
    this.quantitiesSorted = sortByProp(this.quantities, this.quantitiesNoDuplicates, 'ingredientName');
  }

  addIngreients() {
    this.addQuantities(this.quantitiesSorted);
  }

  getSecondMeasurements() {
    this.measurementSort = this.getMeasurements(this.quantitiesSorted);
  }

  getFinalQuantities() {
    this.ingredientsFinal = this.calculateQuantities(this.measurementSort.measurements, this.measurementSort.noDuplicates);
    fractionizer(this.ingredientsFinal);
  }

  clearGroceryList() {
    this.addedRecipes = [];
    this.masterList = [];
    this.noDuplicates = [];
    this.nameSort = [];
    this.measurementSort = [];
    this.quantities = [];
    this.quantitiesNoDuplicates = [];
    this.quantitiesSorted = [];
    this.ingredientsFinal = [];
    this.pantry = [];
    this.freezer = [];
    this.refrigerator =[];
  }


  // takes in an array of ingredients and sorts them by like measurements
  // begin getMeasurements()
  getMeasurements(originalArray) {
    let measurements = [];
    let noDuplicates = [];

    for (let i = 0; i < originalArray.length; i++) {
      noDuplicates.push(removeDups(originalArray[i], 'measurement'));
    }

    for (let i = 0; i < noDuplicates.length; i++) {
      measurements.push(sortByProp(originalArray[i], noDuplicates[i], 'measurement'));
    }

    let sorted = {
      measurements: unNestArray(measurements),
      noDuplicates: unNestArray(noDuplicates)
    };

    return sorted;
  } // end getMeasurements()

  calculateQuantities(originalArray, noDuplicates) {
    let arrayCopy = [];

    for (var i = 0; i < noDuplicates.length; i++) {
      arrayCopy.push(Object.assign({}, noDuplicates[i]));
      let newQuantity = originalArray[i].reduce((x, y) => ({quantity: x.quantity + y.quantity}));
      arrayCopy[i].quantity = newQuantity.quantity;
    }
    return arrayCopy;
  }

  addQuantities(array) {
    for (let i = 0; i < array.length; i++) {
      this.addQuantitiesSingleArray(array[i]);
    }
  }

  // begin addQuantities()
  addQuantitiesSingleArray(array) {
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
}
