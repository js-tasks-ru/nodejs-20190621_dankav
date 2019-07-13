const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Product should have title',
  },
  description: {
    type: String,
    required: 'Description should not be empty',
  },
  price: {
    type: Number,
    required: 'Product should have price',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: 'Category should not be empty',
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    required: 'SubCategory should not be empty',
  },
  images: [{
    type: String,
  }] 
});

module.exports = connection.model('Product', productSchema);
