const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const GroceryList = require('../models/groceryList.model');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Check if user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.send('Must be logged in to add items!');
};

router.get('/', isAuthenticated, (req, res) => {
  GroceryList.find({'userId': req.user._id}, (error, data) => {
    if (error) {
      console.log('Error getting grocery List: ', error);
      res.sendStatus(500);
    } else {
      // console.log('Foud recipes: ', data);
      res.send(data);
    }
  });
});


router.post('/', isAuthenticated, (req, res) => {

  for (let ingredient of req.body.ingredients) {
    ingredient.purchased = false;
  }

  let newGroceryList = {
    userId: req.user._id,
    listName: req.body.name,
    ingredients: req.body.ingredients,
  };
  console.log(newGroceryList);


  let listToSave = new GroceryList(newGroceryList);

  listToSave.save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log('Error on post', error);
      res.sendStatus(500);
    });
});

router.put('/', isAuthenticated, (req, res) => {

  // console.log(req.body._id);

  GroceryList.update(
    {
      'userId': req.user.id,
      'ingredients': {$elemMatch: {'_id': req.body._id}}
    },
    {
      $set:{
        'ingredients.$.purchased': req.body.purchased,
      }
    })
    .then( (response) => {
      console.log('find list response: ', response);
      res.send(response);
    });

});


module.exports = router;
