const path = require('path')
const router = require('koa-better-router')().loadMethods();

const controllers = require('require-all')({
    dirname: path.join(__dirname, './controllers')
})
router.get('/hello', controllers.base.hello);

router.get('*', (ctx, next) => {
    if(ctx.request.url === '/favicon.ico'){
        return true
    }
    ctx.redirect('/hello')
});

module.exports = router;
