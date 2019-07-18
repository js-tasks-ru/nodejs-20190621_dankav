const Product = require('../models/Product');
const mongoose = require('mongoose');

const returnProduct = (product) => {
  return {
    id: product.id, 
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
};

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let searchQuery;
  let products = [];

  // console.log('ctx.query', ctx.query);
  // console.log('ctx.params', ctx.params);
  if(ctx.params.hasOwnProperty('query')) {
    searchQuery = ctx.params.query || '';
  } else if( Object.prototype.hasOwnProperty.call(ctx.query, 'query') ){
    searchQuery = ctx.query.query || '';
  } else {
    ctx.response.status = 400;
    ctx.response.message = `Not valid format of request`;
    return next();
  }

  // console.log('searchQuery', searchQuery);

  await Product.find({$text: {$search: `${searchQuery}`}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})
    .then((resp) => {
      products = [
        ...resp
      ].map(returnProduct);
    })
    .catch((err) => {
      products = [];
    });

  ctx.body = {products: [
    ...products
  ]};
};
