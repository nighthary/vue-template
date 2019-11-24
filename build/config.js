var ip = require('ip');
const path = require('path')
const packageInfo = require('../package.json')
const configJson = require('../config.json')

var env = process.argv.slice(-2);
// 获取当前环境变量
env = env[0] === '--mode' ? env[1] : `local`

var staticLibURI;
var port = configJson.port
switch(env) {
  case 'production':
    staticLibURI = ``
    break
  case 'local':
    staticLibURI = `//${ip.address()}:8080`
    break
  default:
    staticLibURI = `//${ip.address()}:8080`
    break
}

var config = {
  common: {
    resourcePath: path.join(__dirname, '../src'),
    assetsPublicPath: staticLibURI + `/static/${packageInfo.name}/`,
    assetsSubDirectory: '',
    outputDir: path.join(__dirname, `../${packageInfo.buildPath}/static/${packageInfo.name}/`)
  }
}

/**
 * 获取项目配置
 * @param env 环境变量
 * @returns {*}
 */
module.exports.getConfig = function (env) {
  return Object.assign(config.common, config[env])
}
