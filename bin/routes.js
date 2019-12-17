
'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

/*
 * 需要挂载的tpye
 * */
const HTTP_TYPE = ['get', 'post', 'put', 'options', 'head', 'delete', 'trace', 'connect', 'patch'];

function mountRoutes(NS, nsProxy, projectName) {
  // 给NS挂上 onXXX路由方法
  HTTP_TYPE.forEach(type => {
    var name = type.replace(/(.)(.*)/, (all, $1, $2) => {
      return $1.toUpperCase() + $2;
    });
    NS['on' + name] = function () {
      let arr = _.toArray(arguments);
      let arg0 = arr[0] || ''
      // 所有接口请求路由添加前缀（仅部署环境）
      // if(arg0.startsWith('/api')) {
      arr[0] = `/${projectName}${arg0}`
      // }
      nsProxy.addRouter({ type: type, filters: arr });
    }
  });
  // 404
  NS.onNotFound = function (fn) {
    nsProxy.error404(fn);
  };
  // 路由500错误处理
  NS.onError = function (fn) {
    nsProxy.error500(fn)
  }
}
/**
 * 自动加载路由文件
 * @param routersPath
 */
function autoLoadRoutes(routersPath) {
  fs.readdirSync(routersPath).forEach(function (file) {
    var filePath = path.join(routersPath, file);
    var stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      autoLoadRoutes(filePath);
    } else {
      // console.log(filePath);
      // 过滤掉以'.'开头的文件
      if (file[0] !== '.') {
        try {
          require(filePath);
        } catch (e) {
          console.error('[Utopia Router] [error-message]: ' + e.message)
          console.error('[Utopia Router] [error-stack]: ' + e.stack)
        }
      }
    }
  });
}

/**
 *
 * @param router
 * @returns {*}
 */
function wrapRouter(router) {
  // 路由路径不做处理 '/path' /\/path/ ['/path1','/path2']
  if (!_.isFunction(router)) {
    return router;
  }
  return function (req, res, next) {
    router(req, res, next);
  }
}

module.exports.autoLoadRoutes = autoLoadRoutes;
module.exports.mountRoutes = mountRoutes;
module.exports.wrapRouter = wrapRouter;
