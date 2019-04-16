module.exports = {
    async hello(ctx, next){
        await ctx.render('hello', {title: 'hello'})
    },
    async vue(ctx, next){
        await ctx.render('vue', {title: 'vue'})
    },
    async userTableEnter(ctx, next){
        await ctx.render('user-table-enter', { title: '信息录入'})
    }
}
