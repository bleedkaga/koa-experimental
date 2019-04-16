let utils = require('./utils');

function KoaBetterRouter (options) {
    if (!(this instanceof KoaBetterRouter)) {
        return new KoaBetterRouter(options)
    }

    this.options = utils.extend({ prefix: '/' }, options);
    this.route = utils.pathMatch(this.options);
    this.routes = []
};

KoaBetterRouter.prototype.loadMethods = function loadMethods () {
    utils.methods.forEach(function (method) {
        let METHOD = method.toUpperCase();
        KoaBetterRouter.prototype[method] =
            KoaBetterRouter.prototype[METHOD] = function httpVerbMethod () {
                let args = [].slice.call(arguments);
                return this.addRoute.apply(this, [METHOD].concat(args))
            }
    });
    KoaBetterRouter.prototype.del = KoaBetterRouter.prototype['delete'];
    return this
};

KoaBetterRouter.prototype.createRoute = function createRoute(method, route, fns){
    let args = [].slice.call(arguments, 3);
    let middlewares = utils.arrayify(fns).concat(args);

    if(typeof method !== 'string'){
        throw new TypeError('.createRoute: expect `method` to be a string')
    }
};


let router = KoaBetterRouter().loadMethods();
console.log(router.post)
