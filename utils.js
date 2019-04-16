'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;


require('extend-shallow', 'extend');
require('methods');
require('path-match');
require('is-es6-generator-function', 'isGenerator');
require('koa-compose', 'compose');
require('koa-convert', 'convert');


module.exports = utils;
