const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const Schema = require('../models/recipe.model');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Check if user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.send('Must be logged in to add items!');
};

// GET Routes

// gets all recipes associated with user
router.get('/', isAuthenticated, (req, res) => {

  Schema.Recipe.find({'userId': req.user._id}, (error, data) => {
    if (error) {
      console.log('Error getting recipes: ', error);
      res.sendStatus(500);
    } else {
      console.log('Foud recipes: ', data);
      res.send(data);
    }
  });
});

// POST Routes

// adds recipe to database
router.post('/', isAuthenticated, (req, res) => {

  const newRecipe = {
    recipeName : req.body.recipeName,
    userId : req.user._id
  };

  let recipeToSave = new Schema.Recipe(newRecipe);

  recipeToSave.save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log('Error on post', error);
      res.sendStatus(500);
    });
});

// PUT Routes

// updates ingredient list for a single recipe
router.put('/', isAuthenticated, (req, res) => {

  let recipeId = req.body.recipeId;

  Schema.Recipe.findByIdAndUpdate(
    { "_id": recipeId },
    { $set:
      { ingredients: [] } },
    (error, doc) => {
        if (error) {
          errCount++;
          console.log('error on push to Ingredient array: ', error);
          res.sendStatus(500);
        } else {
          console.log('updated Recipe Document: ', doc);
          console.log('-----------------------------');

          for (let i = 0; i < req.body.ingredients.length; i++) {
            let newIngredient = new Schema.Ingredients(req.body.ingredients[i]);
            Schema.Recipe.findByIdAndUpdate(
              { "_id": recipeId },
              { $push:
                { ingredients: newIngredient } },
              (addError, doc) => {
                  if (addError) {
                    console.log('error on push to Ingredient array: ', addError);
                  } else {
                    console.log('updated Recipe Document: ', doc);
                    console.log('-----------------------------');
                  }
              }
            );
          }
          res.sendStatus(201);
        }
    }
  );
});

// DELETE Routes

// removes recipes from database
router.delete('/:id', isAuthenticated, (req, res) => {

  Schema.Recipe.findByIdAndRemove({"_id": req.params.id},
  (error, data )=> {
    if(error){
      console.log('error on remove ', error);
      res.sendStatus(500);
    }else{
      console.log('deleted recipe: ', data);
      res.send(data);
    }
  });
});

module.exports = router;
