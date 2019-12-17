var path = require('path');
var _ = require('lodash');
var express = require('express');
var { getConfig } = require('./config');
var RoutesUtil = require('./routes-util');
var routes;

class NSProxy {
  constructor() {
    this.app = {};
    this._routes = [];
    this._routesUtil = new RoutesUtil();

    this._error404 = null;
    this._error500 = null;
  }

  init(opts) {
    var _this = this
    this.options = _.extend({
      name: '',
      appDir: '',
      logPath: '/var/logs/nodejs'
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
    if (this._configPormise) {
      return this._configPormise;
    }
    this._configPormise = new Promise((resolve, reject) => {
      try {
        var config = getConfig(NS.NODE_ENV);
        NS.config = Object.assign({}, config);
        resolve(config);
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
    this.mountRoutesUtil();

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

    app.use(cookieParser());

    app.use(express.static(path.resolve(this.options.staticPath, '')))

    this._setLogger(app)
  }

  _setLogger(app) {
    const Logger = require('./log');
    const logger = new Logger({
      appName: this.options.appName,
      logPath: this.options.logPath
    })
    logger.use(app);
    logger.overwrideConsole();

    NS.logger = logger.getLogger();
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
  mountRoutesUtil() {
    this._routesUtil.init();

    NS.Utils = this._routesUtil;
  }
}

module.exports = NSProxy
