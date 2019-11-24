
var NSProxy = require('./nsproxy');
var routes = require('./routes');

var NS = {};

var nsProxy = new NSProxy();

NS.init = nsProxy.init.bind(nsProxy);

// 挂载路由
routes.mountRoutes(NS, nsProxy);

global.NS = NS;

module.exports = NS
