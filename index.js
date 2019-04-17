let utils = require('./utils')

function MKoaBetterRouter (options) {
    if (!(this instanceof MKoaBetterRouter)) {
        return new MKoaBetterRouter(options)
    }

    this.options = utils.extend({ prefix: '/' }, options)
    this.route = utils.pathMatch(this.options)
    this.routes = []
}
MKoaBetterRouter.prototype.loadMethods = function loadMethods () {
    utils.methods.forEach(function (method) {
        let METHOD = method.toUpperCase()
        MKoaBetterRouter.prototype[method] =
            MKoaBetterRouter.prototype[METHOD] = function httpVerbMethod () {
                let args = [].slice.call(arguments);
                return this.addRoute.apply(this, [METHOD].concat(args))
            }
    })
    MKoaBetterRouter.prototype.del = MKoaBetterRouter.prototype['delete']
    return this
}

MKoaBetterRouter.prototype.createRoute = function createRoute(method, route, fns){
    let args = [].slice.call(arguments, 3)
    let middlewares = utils.arrayify(fns).concat(args)

    if(typeof method !== 'string'){
        throw new TypeError('.createRoute: expect `method` to be a string')
    }

    let parts = method.split(' ')
    method = parts[0].toUpperCase()

    if(typeof route === 'function'){
        middlewares = [route].concat(middlewares)
        route = parts[1]
    }

    if(Array.isArray(route)){
        middlewares = route.concat(middlewares)
        route = parts[1]
    }

    if(typeof route !== 'string'){
        throw new TypeError('.create: expect `route` be string, array or function')
    }

    let prefixed = utils.createPrefix(this.options.prefix, route)
    middlewares = middlewares.map((fn) =>{
        return utils.isGenerator(fn) ? utils.convert(fn) : fn
    })

    return {
        prefix: this.options.prefix,
        path: prefixed,
        route: route,
        match: this.route(prefixed),
        method: method,
        middlewares: middlewares,
    }
}

MKoaBetterRouter.prototype.addRoute = function addRoute(method, route, fns){
    let routeObject = this.createRoute.apply(this, arguments)
    this.routes.push(routeObject)
    return this
}

MKoaBetterRouter.prototype.getRoute = function getRoute(name){
    if(typeof name !== 'string'){
        throw new TypeError('.getRoute: expect `name` to be a string')
    }
    let res = null
    for(let route of this.routes){
        name = name[0] === '/' ? name.slice(1) : name
        if(name === route.route.slice(1)){
            res = route
            break
        }
    }
    return res
}

MKoaBetterRouter.prototype.addRoutes = function addRoutes(){
    this.routes = this.routes.concat.apply(this.routes, arguments)
    return this
}

MKoaBetterRouter.prototype.getRoutes = function getRoutes () {
    return this.routes
}

MKoaBetterRouter.prototype.groupRoutes = function groupRoutes(dest, src1, src2){
    if(utils.isObject(dest) && !utils.isObject(src1)){
        throw new TypeError('.groupRoute: expect both `dest` and `src1` be objects')
    }
    let pathname = dest.route + src1.route
    let route = this.createRoute(dest.method, pathname, src1.middlewares)

    return utils.isObject(src2) ? this.groupRoutes(route, src2) : route
}

MKoaBetterRouter.prototype.extend = function extend(router){
    if(!(router instanceof MKoaBetterRouter)){
        throw new TypeError('.extend: expect `router` to be instance of MKoaBetterRouter')
    }
    router.routes.forEach((route) =>{
        if(route.prefix !== this.options.prefix){
            route = utils.updatePrefix(this, this.options, route)
        }
        this.routes.push(route)
    })
    return this
}

MKoaBetterRouter.prototype.middleware = function middleware(){
    return (ctx, next) => {
        for(let route of this.routes){
            if(ctx.method !== route.method){
                continue
            }
            let match = route.match(ctx.path, ctx.params)
            if(!match) continue

            route.params = match

            ctx.route = route
            ctx.params = route.params

            return utils.compose(route.middlewares)(ctx).then(() => next());
        }
        return typeof this.options.notFound === 'function' ?
            this.options.notFound(ctx, next) : next();
    }
}

MKoaBetterRouter.prototype.legacyMiddleware = function legacyMiddleware () {
    return utils.convert.back(this.middleware())
}

module.exports = MKoaBetterRouter;
