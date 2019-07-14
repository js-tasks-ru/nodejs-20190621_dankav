const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    // required: 'Name of category should not be empty',
    required: true,
  },
  subcategories: [subCategorySchema]
}, {
  timestamps: true,
});

module.exports = connection.model('Category', categorySchema);
