const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      usernameField: 'email', 
      session: false
    },
    async function(email, password, done) {
      const user = await User.findOne({ email });

      if ( !user ) {
        done(null, false, 'Нет такого пользователя');
      }

      if ( ! await user.checkPassword(password) ) {
        done(null, false, 'Невереный пароль');
      }

      done(null, user);
    }
);
