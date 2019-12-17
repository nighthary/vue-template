'use strict';

const NS = global.NS
const render = require('../service/renderView.js')

NS.onGet('*', function(req, res, next) {
  console.log('接口请求', req.originalUrl)
  const nowPath = req.path;
  if(NS.Utils.isExPath(nowPath)) {
    next()
  } else {
    res.send(render('index'))
  }
})

NS.onGet('/', function(req, res, next) {
  res.send(render('index'))
})

NS.onGet('/ui*', function(req, res, next) {
  res.send(render('ui'))
})

NS.onGet('/api/check', function(req, res) {
  res.sendStatus(200)
})
