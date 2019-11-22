import axios from '../request'
// 请求
// 示例
export function test (data) {
  return axios({
    url: '/posts',
    method: 'get',
    params: data
  })
}

export function getList () {
  return axios({
    url: 'https://www.fastmock.site/mock/86f345654672f73a72d176d73a3cb3d5/demo/api/list',
    method: 'get'
  })
}
