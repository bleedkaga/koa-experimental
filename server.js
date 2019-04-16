const Koa = require('koa');
const staticServer = require('koa-static-server');
const views = require('koa-views');
const path = require('path');
const port = 3001;
const router = require('./router');
const session = require('koa-session');
const koaBody = require('koa-body');
const app = new Koa();
const RES_HOST = '/public';
const RES_PATH = path.join(process.cwd(), RES_HOST); //静态资源路径
app.context.staticPath = RES_HOST;
//加载日志模块
app.use(async (ctx, next) => {
    ctx.util = {
        log: require('./utils/log')
    };
    await next();
});


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

// koa body
app.use(
    koaBody({
        jsonLimit: '1mb',
        formLimit: '100kb',
        textLimit: '100kb',
        onError:(error, ctx) => {
            console.log(`[koa body] error: ${error}`);
            throw err;
        },
        multipart: true,
        formidable: {
            //multipart/form-data
            maxFields: 1000, //query 字符数 (0表示无限制)
            maxFieldsSize: 2 * 1024 * 1024, //默认单位内存量 2MB
            maxFileSize: 20 * 1024 * 1024, //限制上传文件的大小 20MB
            keepExtensions: true,
        }
    })
);
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
        staticPath: RES_HOST,
        world : 'world',
        pathname: ctx.url
    };
    return next();
});

app.use((ctx, next) => { return next() })

//注册路由
app.use((ctx, next) => router.middleware()(ctx, next));

//注册静态文件的访问方式
app.use(
    staticServer({
        rootDir: RES_PATH,
        rootPath: RES_HOST
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
