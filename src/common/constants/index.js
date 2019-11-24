/**
 * 全局变量定义
 */
import Vue from 'vue'
// 存放全局变量，如正则表达式
const globalAA = '示例：我是全局变量'
// 验证规则
const MOBLEPHONE_REG = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
const PASSWORD_REG = /^(\w){6,18}$/
// 中文
const CN_REG = /^[\u4E00-\u9FA5]*$/
// 英文
const EN_REG = /^[\u0391-\uFFE5A-Za-z]*$/

const ENUM = {
  globalAA,
  MOBLEPHONE_REG,
  PASSWORD_REG,
  CN_REG,
  EN_REG
}
Vue.prototype.$constant = ENUM

export default ENUM
