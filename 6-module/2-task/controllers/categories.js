const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

  ctx.body = {
    categories: [
      ...await Category.find({})
    ].map((category) => {
      return {
        id: category.id,
        title: category.title,
        subcategories: [
          ...category.subcategories
          ].map((subcategory) => {
            return {
              id: subcategory['_id'],
              title: subcategory.title,
            }
          }) 
          || [],
      }
    }),
  };
};
