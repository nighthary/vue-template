var path = require('path')
var glob = require('glob')
var fs = require('fs')

var getConfig = require('./config').getConfig

/**
 * 获取入口表
 * @param globPath
 * @returns {{}}
 */
function getEntry (globPath) {
  var entries = {}
  var basename
  var tmp
  var pathname

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    pathname = tmp.splice(-2, 1) + '/' + basename // 正确输出js和html的路径
    entries[pathname] = entry
  })
  console.log(`\n => ${globPath} base-entrys \n`)
  console.log(JSON.stringify(entries, null, '  '))
  return entries
}
/**
 * 递归创建目录
 * @param {String} dirname 路径
 */
function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 获取环境标识 env , 默认是 `local`
 * @returns {string}
 */
function getEnv () {
  var argv = process.argv.slice(-2);
  // 获取当前环境变量
  return argv[0] === '--env' ? argv[1] : `local`;
}

function assetsPath (_path) {
  var env = getEnv();
  var assetsSubDirectory = getConfig(env).assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {
  mkdirsSync: mkdirsSync,
  getEntry,
  getEnv,
  assetsPath
}
