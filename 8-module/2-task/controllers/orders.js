const Order = require('../models/Order');

module.exports.checkout = async function checkout(ctx, next) {

  const order = new Order({
    user: ctx.user.id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  await order.save();
 
  ctx.body = { order: order.id };
  ctx.status = 200;
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user.id }).populate('product');
  // .pipe(
  //   map((order) => {
  //     return {
  //       id: order.id,
  //       user: order.user.id,
  //       product: order.product.populate(),

  //     }
  //   });

  ctx.body = { orders };
  ctx.status = 200;

};
