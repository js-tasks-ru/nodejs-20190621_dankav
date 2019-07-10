const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const connections = new Set();

router.get('/subscribe', async (ctx, next) => {

  const message = await new Promise((resolve) => {
    connections.add(resolve);

    ctx.res.on('close', () => {
      if( !ctx.res.finished ) {
        connections.delete(resolve);
        resolve();
      }
    });
  });

  ctx.response.body = message;
  ctx.response.status = 200;
  ctx.response.message = 'ok';
});

router.post('/publish', async (ctx, next) => {

  let newMessage = ctx.request.body.message;

  // console.log('ctx request', ctx.request.body.message);
  // console.log('ctx newMessage', newMessage);
  // console.log('connections', connections);
  if( !newMessage ) {
    ctx.throw(500, 'Message should not be empty');
  }

  for (resolve of connections ) {
    resolve(newMessage);
  }

  connections.clear();
  ctx.response.status = 200;
  ctx.response.message = 'ok';
});

app.use(router.routes());

module.exports = app;
