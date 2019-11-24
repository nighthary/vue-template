var path = require('path');
var _ = require('lodash');
var express = require('express');
var routes;

class NSProxy {
  constructor() {
    this.app = {};
    this._routes = [];

    this._error404 = null;
    this._error500 = null;
  }

  init(opts) {
    var _this = this
    this.options = _.extend({
      name: '',
      appDir: '',
      logPath: '/var/log/nodejs/'
    }, opts);

    return this._createConfig()
      .then(function (config) {
        _this.loadModules();

        // 获取端口
        var port = config.port;
        // 自动加载路由
        routes.autoLoadRoutes(path.join(_this.options.appDir, 'routes'));

        var app = _this._createApp();
        return require('./boot')(app, {
          port: port
        });
      })
  }

  /** 初始化 project */
  _createConfig() {
    var _this = this;
    if (this._configPormise) {
      return this._configPormise;
    }
    this._configPormise = new Promise((resolve, reject) => {
      try {
        var configJson = require(path.join(_this.options.appDir, 'config.json'));
        NS.config = Object.assign({}, configJson)
        resolve(configJson);
      } catch (e) {
        reject(e);
      }
    });
    return this._configPormise;
  }

  _createApp() {
    var app = this.app = express();
    NS.app = app;

    // 中间件
    this._setAppConfig(app);

    this.createRoutes(app);

    // todo 提供默认错误展示
    this._error404 && app.use(this._error404);
    this._error500 && app.use(this._error500);
    return app;
  }

  _setAppConfig(app) {
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');

    // 禁用x-powered-by
    app.disable('x-powered-by');

    // body-parser limit 50mb
    // https://github.com/expressjs/body-parser#limit
    app.use(bodyParser.json({ limit: '50mb' }));
    // https://github.com/expressjs/body-parser#extended
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // app.use((req, res, next) => {
    //   // 设置是否运行客户端设置 withCredentials
    //   // 即在不同域名下发出的请求也可以携带 cookie
    //   res.header("Access-Control-Allow-Credentials",true)
    //   // 第二个参数表示允许跨域的域名，* 代表所有域名
    //   res.header('Access-Control-Allow-Origin', '*')
    //   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
    //   // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    //   if (req.method === 'OPTIONS') {
    //     res.sendStatus(200)
    //   } else {
    //     next()
    //   }
    // })
    app.use(cookieParser());

    app.use(express.static(path.resolve(this.options.staticPath, '')))
  }

  addRouter(router) {
    this._routes.push(router);
  }

  loadModules() {
    routes = require('./routes');
  }

  error404(fn) {
    this._error404 = fn;
  }

  error500(fn) {
    this._error500 = fn;
  }

  /**
   * 路由处理，经过wrapRouter处理返回的view
   * @param app
   */
  createRoutes(app) {
    this._routes.forEach(item => {
      var routerFilters = item.filters || [];
      if (item.type) {
        // 取出最后一个回调为渲染路由，进行封装
        var finallyRouter = routerFilters.pop();
        finallyRouter && routerFilters.push(routes.wrapRouter(finallyRouter));
        app[item.type].apply(app, routerFilters);
      } else {
        app.use(item.path, item.handle);
      }
    });
  }
}

module.exports = NSProxy
