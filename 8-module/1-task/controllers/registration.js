const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  // console.log('body',  ctx.request.body )
  const userData = {
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
    password: ctx.request.body.password,
  };

  try {
    const user = new User(userData);
    await user.setPassword(userData.password);
    await user.save();
  } catch (error) {
    // console.log('error', error);
    // console.log('error.name', error.errors['email'].message);
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  const response = await sendMail({
    template: 'confirmation',
    locals: {token: token},
    to: userData.email,
    subject: 'Подтвердите почту',
  });
  
  // console.log('response', response );

  ctx.status = 200;
  ctx.body = {status: 'ok'};
  
  return next();
};

module.exports.confirm = async (ctx, next) => {

  const token = uuid();
  // console.log('body',  ctx.request.body )
  const verificationToken = ctx.request.body.verificationToken;

  try {
    const user = await User.findOneAndUpdate(
      {verificationToken},
      {$unset: {verificationToken: undefined}}
    );

    if( !user ) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
    }

    ctx.body = { token };

  } catch (error) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
  }

  ctx.status = 200;
  
  return next();
};
