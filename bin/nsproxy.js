var path = require('path');
var _ = require('lodash');
var express = require('express');
var configJson = require('../config.json')

class NSProxy {
  constructor() {
    this.app = {};
  }

  init(opts) {
    var _this = this
    this.options = _.extend({
      name: '',
      appDir: '',
      logPath: ''
    }, opts);

    return this._createConfig()
      .then(function (config) {
        // 获取端口
        var port = config.port;

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

    this._createRoutes(app);

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
    app.use(bodyParser.json());
    // https://github.com/expressjs/body-parser#extended
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

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

  _createRoutes(app) {
    const routes = require('../routes');
    app.use(routes);
  }
}

module.exports = NSProxy
