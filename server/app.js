const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const body = require('koa-body');
const app = new Koa();
const router = new Router();
const DozSSR = require('doz-ssr');
const isDevelop = process.env.NODE_ENV === 'development';
let dozSSR;

function createSSR () {
    dozSSR = new DozSSR('./dist/index.html');
}

router.get('*', async ctx => {
    if (isDevelop) createSSR();
    ctx.body = await dozSSR.render(ctx.path);
});

app
    .use(serve('./dist/', {index: false}))
    .use(body())
    .use(router.routes())
    .use(router.allowedMethods());

if(!isDevelop) {
    app.listen(80, createSSR);
}

module.exports = app;