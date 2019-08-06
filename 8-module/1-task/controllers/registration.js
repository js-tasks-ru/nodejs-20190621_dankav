const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  console.log('body',  ctx.request.body )
  const userData = {
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
    password: ctx.request.body.password,
  };

  const user = new User(userData);
  await user.setPassword(userData.password);
  await user.save();
  
  ctx.status = 200;
  ctx.body = {status: 'ok'};
  
  return next();
};

module.exports.confirm = async (ctx, next) => {
};
