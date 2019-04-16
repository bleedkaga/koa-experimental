const path = require('path');
const router = require('koa-better-router')().loadMethods();
const controllers = require('require-all')({
    dirname: path.join(__dirname, './controllers')
});

router.get('/hello', controllers.base.hello);
router.get('/vue', controllers.base.vue);

router.get('*', (ctx, next) => {
    const ignorePath = [ctx.staticPath, '/favicon.ico'];
    if(ignorePath.some(m => ctx.url.indexOf(m) > -1)){
        return true
    }
    ctx.redirect('/hello')
});

module.exports = router;
