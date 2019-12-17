
var NSProxy = require('./nsproxy');
var routes = require('./routes');
var utils = require('./utils');

const packageInfo = require('../package.json')

var NS = {
  // 获取当前运行环境
  NODE_ENV: utils.getEnv(),
  projectName: packageInfo.projectName

};

var nsProxy = new NSProxy();
NS.init = nsProxy.init.bind(nsProxy);
// 挂载路由
routes.mountRoutes(NS, nsProxy, NS.projectName);

global.NS = NS;

module.exports = NS
