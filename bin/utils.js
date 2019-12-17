'use strict';
/**
 * 获取运行env
 */
const getEnv = () => {
  // 获取当前环境变量
  return process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
}

module.exports = {
  getEnv
}
