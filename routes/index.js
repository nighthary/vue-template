
const NS = global.NS
const render = require('../service/renderView.js')

NS.onGet('/', function(req, res) {
  res.send(render('index'))
})

NS.onGet('/ui', function(req, res) {
  res.send(render('ui'))
})

NS.onGet('/check', function(req, res) {
  res.send(200)
})
