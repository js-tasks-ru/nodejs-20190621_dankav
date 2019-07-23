const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      usernameField: 'email', 
      session: false
    },
    async function(email, password, done) {
      // console.log('email', email);
      // console.log('password', password);
      await User.findOne({ email })
        .then( async (user) => {
          // console.log('user', user);

          if ( !user ) {
            done(null, false, 'Нет такого пользователя');
          }

          if ( ! await user.checkPassword(password) ) {
            done(null, false, 'Невереный пароль');
          }

          done(null, user);
        })
        .catch((err) => {
          done(err);
        })
    }
);
