var log4js = require('log4js');

class Logger {
  constructor(options) {
    this.logPath = options.logPath || '/var/nodejs/logs'
    this.appName = options.appName
    this.configure()
  }

  configure() {
    log4js.configure({
      appenders: {
        ruleConsole: { type: 'console' },
        ruleFile: {
          type: 'dateFile',
          // 这个目录是相对于根目录的，即与app.js 是同一级的
          filename: `${this.logPath}/${this.appName}/info-log`,
          pattern: 'yyyy-MM-dd.log',
          maxLogSize: 10 * 1000 * 1000,
          numBackups: 3,
          alwaysIncludePattern: true
        },
        errorFile: {
          type: 'dateFile',
          // 这个目录是相对于根目录的，即与app.js 是同一级的
          filename: `${this.logPath}/${this.appName}/error-log`,
          pattern: 'yyyy-MM-dd.log',
          maxLogSize: 10 * 1000 * 1000,
          numBackups: 3,
          alwaysIncludePattern: true
        }
      },
      categories: {
        default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' },
        error: { appenders: ['errorFile', 'ruleFile'], level: 'error' }
      }
    });
  }

  use(app) {
    app.use(log4js.connectLogger(this.getLogger(), { level: 'debug', format: ':method :url' }));
  }

  getLogger(name) {
    return log4js.getLogger(name || 'DLYD')
  }

  overwrideConsole() {
    const infoLogger = this.getLogger()
    const errorLogger = this.getLogger('error')
    console.log = info
    console.trace = info
    console.info = info
    console.debug = info

    console.warn = error
    console.error = error
    function info() {
      infoLogger.info('INFO    ', Array.prototype.slice.call(arguments).join('   '));
    }

    function error() {
      errorLogger.error('ERROR    ', Array.prototype.slice.call(arguments).join('   '));
    }
  }
}

module.exports = Logger
