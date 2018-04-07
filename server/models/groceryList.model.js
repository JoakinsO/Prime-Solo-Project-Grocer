const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroceryListSchema = new Schema({
  userId : {type: mongoose.Schema.ObjectId, ref: 'Person'},
  listName: {type: String, required: true},
  ingredients : [],
});

module.exports = mongoose.model('GroceryList', GroceryListSchema);
