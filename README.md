# vue-template
vue template visited with nodejs





### gulp构建node代码

由于和vue在同一个项目，公用了babel配置，因此根目录的gulp执行只进行拷贝node目录至子目录，在打包输出目录中进行压缩混淆命令（gulp mini）





### 部署

#### 压缩nodejs代码部署

对应脚本```www-localize```

```
echo '开始安装依赖(npm i)'
npm i
echo '安装依赖完成，开始构建(npm run build),测试环境可以执行(npm run test)--浏览器可以查看代码映射'
npm run build
echo '前端构建完成，整理node代码(npm run copy)'
npm run clean
npm run copy
echo '代码copy完成'
cd ./ns-release-dist
echo '执行node代码压缩混淆(npm run mini)'
npm i
npm run mini
echo '安装pm2（npm i pm2 -g)'
npm i pm2 -g
echo '删除PM2进程'
pm2 delete all
echo '运行pm2 start start.js 启动项目'
pm2 start start.js
echo '查看日志'
pm2 logs
```

#### 不压缩nodejs代码部署

对应脚本```www```

```
echo '开始安装依赖(npm i)'
npm i
echo '安装依赖完成，开始构建(npm run build),测试环境可以执行(npm run test)--浏览器可以查看代码映射'
npm run build
echo '安装pm2（npm i pm2 -g)'
npm i pm2 -g
echo '删除PM2进程'
pm2 delete all
echo '运行pm2 start start.js 启动项目'
pm2 start start.js
echo '查看日志'
pm2 logs
```

