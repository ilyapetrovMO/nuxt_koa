const Router = require('koa-router');
const Koa = require('koa');

const app = new Koa();
var router = new Router();

router.get('/qwe',index);

async function index(ctx){
    ctx.body = 'Hello World';
}

app.use(router.routes());
app.listen(3001);