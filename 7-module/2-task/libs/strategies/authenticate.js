const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {

  if (! email ) {
    done(null, false, 'Не указан email');
  }

  const user = await User.findOne({email}).catch((err) => {
    done(err);
  });

    // console.log('resuserult',user);
  if ( !user ) {

    // console.log('HERE');
    const newUser = new User({email, displayName});
    await User.save();
    // console.log('result',result);
    done(null, newUser, 'Пользователь создан');
  }
};
