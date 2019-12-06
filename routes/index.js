
const NS = global.NS
const render = require('../service/renderView.js')
const packageInfo = require('../package.json')
const resourceMap = require(`../${packageInfo.buildPath}/ns-resource-map/resource-map.json`)
NS.pages = Object.keys(resourceMap)

NS.onGet('/*', function(req, res, next) {
  const nowPath = req.path.split('/')[1]
  if(NS.pages.includes(nowPath)) {
    next()
  } else {
    res.send(render('index'))
  }
})

NS.onGet('/ui*', function(req, res) {
  res.send(render('ui'))
})

NS.onGet('/check', function(req, res) {
  res.sendStatus(200)
})

NS.onGet('/test1', function(req, res) {
  console.info('info...')
  console.error('error...')
  console.warn('warn...')
  console.log('测试console.log')
  res.sendStatus(200)
})
