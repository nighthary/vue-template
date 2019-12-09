# vue-template
package nodejs code with webpack

### 开发注意事项

由于nodejs接管了前端路由，所以在nodejs端定义路由时需要遵循一些规则，才能保证页面或者接口正常访问

##### 页面路由

```
NS.onGet('/*', function(req, res, next){ 
	TODO: 此处是所有路由入口，注意区分页面路由（多入口项目等同于接口请求，不要使用默认render）和接口请求
	const nowPath = req.path.split('/')[1]
    if(NS.pages.includes(nowPath) || req.path.startsWith('/api')) {
    	next()
    } else {
    	res.send(render('index'))
    }
})

# 接口请求统一添加前缀 
NS.onGet('/api/test', function(req, res){res.send(200)})
```


### 开发

```
# 启动前端代码编译
npm run serve

# nodejs层启动
npm start

开发模式访问时前端界面依然访问run serve提供的服务
```



线上部署后直接访问nodejs开放的端口即可（nodejs层做了静态文件访问处理）
