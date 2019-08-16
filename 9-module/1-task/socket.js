const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const query = socket.handshake.query;
    
    if (!query.token) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }

    const session = await Session.findOne({token: query.token}).populate('user');
    if (!session) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }
    socket.user = session.user;
    // console.log('session', session);
    // console.log('socket.user', socket.user);
    // console.log('query', query);
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      // console.log('socket.user', socket.user);
      const message = new Message({
        date: new Date(),
        user: socket.user.displayName,
        text: msg,
        chat: socket.user.id,
      });

      // console.log(message);
      await message.save();
    });
  });

  return io;
}

module.exports = socket;
