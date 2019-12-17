
function getRandom(e) {
  e = e || 32;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var a = t.length
  var n = ''
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

const { digestDataBySM3WithSM2 } = require('./lib/pki-base-node');
function doSign(data) {
  return digestDataBySM3WithSM2(JSON.stringify(data), NS.config.PRI_KEY)
}

module.exports = {
  getRandom,
  doSign
}
