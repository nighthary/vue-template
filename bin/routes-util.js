const packageInfo = require('../package.json');
const resourceMap = require(`../${packageInfo.buildPath}/ns-resource-map/resource-map.json`);

class RoutesUtil {
  /**
   * 路由处理工具
   * @param {Object} options 配置项
   */
  constructor(options) {
    this.opts = Object.assign({}, options);
    this.exPaths = [];
    this.frontPages = [];
  }

  init() {
    this._mountExcludes()
  }

  /**
   * 整理需要nodejs直接处理的路由，即不用渲染前端页面
   * api
   * *pages
   */
  _mountExcludes () {
    this.addExPath('api');
    // 处理所有前端路由并挂载到前端路由列表中
    this._getPages().then(pages => {
      pages.map(this.addExPath.bind(this));
    })
    if(this.opts.paths) {
      this.opts.paths.map(this.addExPath);
    }
  }

  _getPages () {
    return new Promise((resolve, reject) => {
      const pages = Object.keys(resourceMap);
      this.frontPages = [].concat(pages);
      resolve(pages);
    })
  }

  addExPath(pathStr) {
    if(!pathStr) return
    pathStr = `/${NS.projectName}/${pathStr}`
    if(this.exPaths.includes(pathStr)) {
      return
    }
    this.exPaths.push(pathStr)
  }

  delExPath(pathStr) {
    if(!pathStr) return
    let zIndex = this.exPaths.indexOf(pathStr)
    if(zIndex) {
      let arr1 = this.exPaths.slice(0, zIndex)
      let arr2 = this.exPaths.slice(zIndex + 1, this.exPaths.length)
      this.exPaths = arr1.concat(arr2)
      return true
    }
  }

  isExPath(pathStr) {
    return Boolean(this.exPaths.find(str => pathStr.startsWith(str)))
  }
}

module.exports = RoutesUtil
