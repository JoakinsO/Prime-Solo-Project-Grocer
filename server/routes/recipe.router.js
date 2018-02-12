const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const Recipe = require('../models/recipe.model');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();


// COMBAK: Refactor this
router.post('/', (req, res) => {

  const newRecipe = {
    recipeName : req.body.recipeName,
    userId : req.user._id
  };
  // console.log(newRecipe);

  let recipeToSave = new Recipe.Recipe(newRecipe);

  recipeToSave.save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      next(error);
    });
});

router.put('/', (req, res) => {
  // console.log(req.body);

  let recipeId = req.body.recipeId;

  for (let i = 0; i < req.body.ingredients.length; i++) {
    let newIngredient = new Recipe.Ingredients(req.body.ingredients[i]);
    Recipe.Recipe.findByIdAndUpdate(
      { "_id": recipeId },
      { $push: { ingredients: newIngredient } },
      (pusherror, doc) => {
          if (pusherror) {
              console.log('error on push to ingredient array: ', pusherror);
              res.sendStatus(500);
          } else {
              console.log('updated Recipe Document: ', doc);
              console.log('-----------------------------');
              res.sendStatus(201);
          }
      }
    );
  }
});

module.exports = router;
