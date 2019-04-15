module.exports = {
    async hello(ctx, next){
        await ctx.render('hello')
    }
}
