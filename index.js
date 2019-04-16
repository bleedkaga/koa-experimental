let utils = require('./utils');

function KoaBetterRouter (options) {
    if (!(this instanceof KoaBetterRouter)) {
        return new KoaBetterRouter(options)
    }

    this.options = utils.extend({ prefix: '/' }, options)
    this.route = utils.pathMatch(this.options)
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
