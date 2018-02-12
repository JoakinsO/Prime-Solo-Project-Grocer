const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema
const RecipeSchema = new Schema({
  recipeName : { type: String, required: true},
  ingredients : [],
  userId : {type: mongoose.Schema.ObjectId, ref: 'Person'}
});

module.exports = mongoose.model('Recipe', RecipeSchema);
