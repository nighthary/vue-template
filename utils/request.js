var request = require('request');

const { doSign } = require('./index');
const dayjs = require('dayjs');

function prepareData(options) {
  options = Object.assign(options, {
    method: 'POST',
    isSign: true
  })

  let { url, data, isSign, header } = options

  header = Object.assign({
    'content-type': 'application/json'
  }, header)

  const defaultHead = {
    applyId: '123', // 默认任意值即可，不能为空
    appId: '123', // 默认任意值即可，不能为空
    dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    version: 'string'
  }
  data.head = {
    ...defaultHead,
    ...data.head,
    isId: (data.head && data.head.applyId) || ''
  }

  if(isSign) {
    let sign = doSign(data.body)
    data.head.sign_msg = sign
  }
  // 封装request请求 post get
  url = NS.config.baseURI + url;
  console.log(url, ':', JSON.stringify(data))
  return {
    ...options,
    header,
    data,
    url
  }
}
function httpRequest(options) {
  options = prepareData(options);
  let { url, data, method, header } = options;
  // form-data格式
  if(options.form) {
    return requestForm(Object.assign(options, {
      url,
      headers: header
    }));
  }
  return new Promise((resolve, reject) => {
    if (method === 'GET') {
      try {
        request({
          url: url,
          method: 'GET',
          headers: header,
          data
        }, function (error, response, body) {
          if(error) {
            return reject(error)
          }
          var data = JSON.parse(body)
          resolve(data)
        })
      } catch (err) {
        console.error('response data error', err);
        reject(err)
      }
    } else if (method === 'POST') {
      try {
        request({
          url: url,
          method: 'POST',
          headers: header,
          body: JSON.stringify(data)
        }, function (error, response, body) {
          if(error) {
            return reject(error)
          }
          var data = JSON.parse(body)
          resolve(data)
        });
      } catch (err) {
        console.error('response data error', err);
      }
    }
  })
}

function requestForm(option) {
  return new Promise((resolve, reject) => {
    request({
      url: option.url,
      formData: option.data,
      method: 'POST',
      headers: option.headers
    }, function(err, response, body) {
      if(err) {
        return reject(err)
      }
      var data = JSON.parse(body)
      resolve(data)
    })
  })
}

module.exports = httpRequest
