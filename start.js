var NS = require('./bin/index');
var packageInfo = require('./package.json')

NS.init({
  appDir: __dirname,
  appName: packageInfo.name,
  staticPath: packageInfo.buildPath
}).catch(e => {
  console.error(e);
})
