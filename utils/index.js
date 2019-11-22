var fs = require('fs')
var path = require('path')

// 写入文件
const writeFileRecursive = function (zPath, buffer, callback) {
  let lastPath = zPath.substring(0, zPath.lastIndexOf(path.sep))
  fs.mkdir(lastPath, { recursive: true }, (err) => {
    if (err) return callback(err)
    fs.writeFile(zPath, buffer, function (err) {
      if (err) return callback(err)
      return callback(null)
    })
  })
}

// 创建多级目录
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

// 读取指定路径下所有json文件
function readData(dataPath) {
  if(!dataPath) return []
  if(!fs.existsSync(dataPath)) {
    return []
  }
  var dirs = []
  let files = fs.readdirSync(dataPath)
  for (var i = 0; i < files.length; i++) {
    var filePath = path.join(dataPath, files[i])
    var info = fs.statSync(filePath)
    if (info.isFile()) {
      var data = fs.readFileSync(filePath)
      try {
        var json = JSON.parse(data.toString())
        dirs.push(json)
      } catch (error) {
        dirs.push(data.toString())
      }
    }
  }
  return dirs
}

/**
 * 获取指定路径文件内容
 * @param {String} zPath 获取数据的路径
 */
function getData(zPath) {
  let zBuffer = fs.readFileSync(zPath)
  let jsonStr = zBuffer.toString()
  let ret = []
  try{
    ret = JSON.parse(jsonStr)
  }catch(e) {
    ret = []
  }

  return ret
}

module.exports = {
  mkdirsSync,
  writeFileRecursive,
  readData,
  getData
}
