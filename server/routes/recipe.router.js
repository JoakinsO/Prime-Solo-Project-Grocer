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
  console.log(newRecipe);

  let recipeToSave = new Recipe(newRecipe);

  recipeToSave.save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
