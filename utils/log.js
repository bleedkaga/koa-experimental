const log4js = require('log4js');

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: `logs/${new Date().toLocaleDateString()}.log`}
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'info' }
    }
});

// log4js.configure({
//     appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
//     categories: { default: { appenders: ['cheese'], level: 'error' } }
// });
let logger = log4js.getLogger();
module.exports = logger;
