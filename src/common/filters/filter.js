// 过滤器
export default {
  // 转大写
  upper: function (value) {
    return value.toUpperCase()
  },
  // 转小写
  lower: function (value) {
    return value.toLowerCase()
  },
  testFilter (value) {
    return value + '123'
  }
}
