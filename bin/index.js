
var NSProxy = require('./nsproxy');

const packageInfo = require('../package.json')
const buildPath = packageInfo.buildPath
const resourceMap = require(`../${buildPath}/ns-resource-map/resource-map.json`)

var NS = {};

var nsProxy = new NSProxy();

NS.init = nsProxy.init.bind(nsProxy);

global.NS = NS;

// 挂载所有页面名称，方便页面渲染时入口分发
NS.pages = Object.keys(resourceMap)

module.exports = NS
