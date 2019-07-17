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

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!ctx.query) {
    return next();
  }
  // console.log('ctx.query', ctx.query);
  let products = []
  await Product.find({subcategory: ctx.query.subcategory})
    .then((productsRes) => {
      products = [...productsRes].map(returnProduct);
    })
    .catch((err) => {
      products = [];
    })

  ctx.body = {
    products: [
      ...products
    ],
  };
};

module.exports.productList = async function productList(ctx, next) {
  if (ctx.query) {
    return next();
  }

  ctx.body = {
    products: [
      ...await Product.find({})
    ].map(returnProduct),
  };
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.response.status = 400;
    ctx.response.message = `${ctx.params.id} is not valid ObjectId parameter`;
    return next();
  }

  // console.log('ctx', ctx);
  // console.log('ctx.id', ctx.id);
  // console.log('ctx.params', ctx.params);

  let product = []
  await Product.find({ _id: ctx.params.id})
    .then((productsRes) => {
      // console.log('productsRes', productsRes);

      if(!productsRes.length) {
        ctx.response.status = 404;
        ctx.response.message = `Product with ${ctx.params.id} id was not found`;
        return next();
      }

      product = [...productsRes].map(returnProduct)[0];
    })
    .catch((err) => {
      // console.log('productsRes', productsRes);
      ctx.response.status = 404;
      ctx.response.message = `Error happened ${err}`;
      return next();
    })

  // console.log('productdd', product);
  ctx.body = {
    product: {
      ...product
    }
  };
   
};

