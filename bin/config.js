const config = {
  common: {
    port: 3000,
    baseURI: 'http://127.0.0.1'
  },
  dev: {
    baseURI: 'http://192.168.1.1:8081'
  },
  test: {
    baseURI: 'http://192.168.1.1:8081'
  },
  production: {
    baseURI: 'http://192.168.1.1:8081'
  }
}

/**
 * 获取项目配置
 * @param env 环境变量
 * @returns {*}
 */
module.exports.getConfig = function (env) {
  console.log('=====', env)
  return Object.assign(config.common, config[env])
}
