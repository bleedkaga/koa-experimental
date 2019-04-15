const Koa = require('koa');
const staticServer = require('koa-static-server');
const views = require('koa-views');
const path = require('path');
const port = 3001;
const router = require('./router');
const session = require('koa-session');
const app = new Koa();

//加载日志模块
app.use(async (ctx, next) => {
    ctx.util = {
        log: require('./utils/log')
    };
    await next();
})


app.use(session({
    prefix: 'gsg-',
    key: 'goodsogood org compensation official pc',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}, app));

//侦听错误
app.use(async (ctx, next) => {

    try {
        await next();
    } catch(e){
        ctx.body = {code: 'error', message: '错误 ' + e};
        ctx.code = 400;
    }
});

//模板渲染
app.use(
    views(path.join(__dirname, './views'), {
        map: {
            html: 'ejs'
        },
        extension: 'html'
    })
);

//页面变量注入
app.use( async (ctx, next) => {
    ctx.state = {
        world : 'world'
    };
    return next();
});

app.use((ctx, next) => { return next() })

//注册路由
app.use((ctx, next) => router.middleware()(ctx, next));

//注册静态文件的访问方式
app.use(
    staticServer({
        rootDir: path.join(process.cwd(), '/public'),
        rootPath: '/public'
    })
);

app.use(async (ctx, next) => {
    ctx.util.log.info(`request url: ${ctx.request.url} method: ${ctx.request.method}`)
    await next();
});

app.listen(port, (err) => {
    if(err) throw Error(err);
    console.log('app is running port : 127.0.0.1', port)
});
