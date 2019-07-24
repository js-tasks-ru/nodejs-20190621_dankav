const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

  if (! email ) {
    return done(null, false, 'Не указан email');
  }

  User.findOne({ email })
    .then(async (result) => {

      if ( !result ) {
        const newUser = await new User({email, displayName});
        await newUser.save();
        return done(null, newUser, 'Пользователь создан');
      } 
      
      return done(null, result, 'Пользователь');
    })
    .catch((err) => {
      done(err, false, 'Некорректный email.');
    });
};
