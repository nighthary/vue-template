
var NSProxy = require('./nsproxy');
var routes = require('./routes');

const packageInfo = require('../package.json')
const resourceMap = require(`../${packageInfo.buildPath}/ns-resource-map/resource-map.json`)

var NS = {};

var nsProxy = new NSProxy();

NS.init = nsProxy.init.bind(nsProxy);

// 挂载路由
routes.mountRoutes(NS, nsProxy);

global.NS = NS;

// 挂载所有页面名称，方便页面渲染时入口分发
NS.pages = Object.keys(resourceMap)

module.exports = NS
