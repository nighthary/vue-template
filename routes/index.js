
const express = require('express');
const router = express.Router();

const render = require('../service/renderView.js');
const NS = global.NS;
const test = require('./test');
router.use(test);

router.get('*', function(req, res, next) {
  const nowPath = req.path.split('/')[1]
  if(NS.pages.includes(nowPath) || req.path.startsWith('/api') || req.path.startsWith('/static')) {
    next()
  } else {
    res.send(render('index'))
  }
})

router.get('/', function(req, res, next) {
  res.send(render('index'))
})

router.get('/ui*', function(req, res) {
  res.send(render('ui'))
})

router.get('/check', function(req, res) {
  res.sendStatus(200)
})

router.get('/api/test1', function(req, res) {
  console.info('info...')
  console.error('error...')
  console.warn('warn...')
  console.log('测试console.log')
  res.sendStatus(200)
})

module.exports = router
