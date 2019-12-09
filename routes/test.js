const express = require('express');
let router = express.Router();

router.get('/api/test', function(req, res) {
  res.send({
    success: true,
    data: [{
      name: 'zs',
      age: 23
    }]
  })
})

module.exports = router
