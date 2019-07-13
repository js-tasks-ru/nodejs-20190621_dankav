const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Name of category should not be empty',
  },
  subcategories: [{
    title: {
      type: String,
      required: 'Subcategory should have Title',
    }
  }],
});

const categorySchema = new mongoose.Schema({
  subcategories: [subCategorySchema]
});

module.exports = connection.model('Category', categorySchema);
