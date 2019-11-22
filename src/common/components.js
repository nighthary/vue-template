import Vue from 'vue'

import qs from 'qs'

// moment.js 精简版
import dayjs from 'dayjs'

// axios发送对象，使用this.qs.stringify(obj)
Vue.prototype.qs = qs

// 时间格式化  this.$moment(this.date).format("YYYY-MM-DD")
Vue.prototype.$dayjs = dayjs
