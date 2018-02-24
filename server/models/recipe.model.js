const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const IngredientsSchema = new Schema({
  ingredientName: {type: String, required: true},
  category : {type: String, required: true},
  quantity : {type: Number, required: true},
  measurement : {type: String, required: true}
});

const RecipeSchema = new Schema({
  recipeName : { type: String, required: true},
  ingredients : [IngredientsSchema],
  userId : {type: mongoose.Schema.ObjectId, ref: 'Person'}
});


module.exports = {
  Recipe: mongoose.model('Recipe', RecipeSchema),
  Ingredients: mongoose.model('Ingredients', IngredientsSchema)
};
