# 基础框架

### 模块说明

```
api -- 接口请求定义
assets -- 静态资源
common -- 通用模块存放（js）
	constants 	-- 全局变量
	directives 	-- 全局指令
	filters 	-- 全局过滤器
	plugins		-- 全局方法定义
	request		-- 网络请求
	utils		-- 通用工具模块
	component.js 	-- 第三方框架引入
	event-bus.js	-- eventbus
	index.js 		-- 入口
components 	-- 全局公共组件
mixins 		-- vue mixmins
router		-- 路由注册
store  		-- vuex（状态管理）
views  		-- 前端界面
```

### 插件说明

**```dayjs```**

日期处理工具，```moment.js```精简版

**```axios```**
```http```请求库

**```qs```**

网络请求字符串拼接处理

### 其他

**日志输出**

```vue.config.js```中已经添加生产环境打包时去除console相关输出

**打包分析**

>npm run build-report 
>
>127.0.0.1:8888 查看

### 开发环境（IDE）插件推荐

#### Path Intellisense

1、解决```vue```中使用别名后路径无法跟踪和转向定义的问题，推荐使用此插件（vscode）

2、在```vscode```的```setting.json```中添加如下配置

```json
"path-intellisense.mappings": {
  "@": "${workspaceRoot}/src"
}
```

3、在```package.json```同级配置```jsconfig.json```，本项目中已经默认配置，可以视自己情况进行修改

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "target": "ES6",
    "allowSyntheticDefaultImports": true
  },
  "exclude": ["node_modules"]
}
```

