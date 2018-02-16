const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const Recipe = require('../models/recipe.model');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();


router.get('/', (req, res) => {
  console.log(req.user);
  Recipe.Recipe.find({'userId': req.user._id}, (error, data) => {
    if (error) {
      console.log('Error getting recipes: ', error);
      res.sendStatus(500);
    } else {
      console.log('Foud recipes: ', data);
      res.send(data);
    }
  });
});


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
  let recipeId = req.body.recipeId;
  let errCount = 0;

  Recipe.Recipe.findByIdAndUpdate(
    { "_id": recipeId },
    { $set:
      { ingredients: [] } },
    (pusherror, doc) => {
        if (pusherror) {
          errCount++;
          console.log('error on push to Ingredient array: ', pusherror);
        } else {
          console.log('updated Recipe Document: ', doc);
          console.log('-----------------------------');
        }
    }
  );

  for (let i = 0; i < req.body.ingredients.length; i++) {
    let newIngredient = new Recipe.Ingredients(req.body.ingredients[i]);

    Recipe.Recipe.findByIdAndUpdate(
      { "_id": recipeId },
      { $push:
        { ingredients: newIngredient } },
      (pusherror, doc) => {
          if (pusherror) {
            errCount++;
            console.log('error on push to Ingredient array: ', pusherror);
          } else {
            console.log('updated Recipe Document: ', doc);
            console.log('-----------------------------');
          }
      }
    );
  }

  if(errCount > 0) {
      res.sendStatus(500);
  } else {
      res.sendStatus(201);
  }

});

router.delete('/:id', (req, res) => {
  console.log(req.params.id);
  Recipe.Recipe.findByIdAndRemove({"_id": req.params.id},
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
