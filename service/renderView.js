/**
 * @desc 页面渲染服务
 */
'use strict'
const packageInfo = require('../package.json')
// 资源表
const resourceMap = require(`../${packageInfo.buildPath}/ns-resource-map/resource-map.json`)

module.exports = function (pageName) {
  var linkList = ``
  var scriptList = ``

  resourceMap[pageName].js.forEach(function (item) {
    var script = `<script src="${item}"></script>`
    scriptList = scriptList + script
  })

  resourceMap[pageName].css.forEach(function (item) {
    var link = `<link rel="stylesheet" href="${item}">`
    linkList = linkList + link
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="renderer" content="webkit"/>
    <meta http-equiv="Cache-Control" content="no-transform "/>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
    <title>vue-template</title>
    <meta name='keywords' content=''/>
    <meta name='description' content=''/>
    <link rel="icon" href="/${packageInfo.projectName}/static/${packageInfo.name}/favicon.ico" />
    ${linkList}
    <script type="text/javascript">
     window.cInfo={
      baseURI: '${`${NS.config.baseURI}`}'
     }
    </script>
    </head>
    <body class="w-body">
    <div id="app"></div>
    ${scriptList}
    </body>
    </html>`
}
