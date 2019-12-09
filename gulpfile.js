var gulp = require('gulp') // gulp基础包
var clean = require('gulp-clean')
var rename = require('gulp-rename')
var notify = require('gulp-notify') // 提示信息

const packageInfo = require('./package.json')

const buildInfo = {
  outputDir: packageInfo.buildPath + '-dist',
  nodeOutput: 'node-dist'
}

/**
 * 清空目标目录
 */
gulp.task('clean', function () {
  return gulp.src([`${buildInfo.outputDir}`], {
    allowEmpty: true
  }).pipe(clean())
})

gulp.task('copy', function(){
  return gulp.src([`${packageInfo.buildPath}/**/*`, `${buildInfo.nodeOutput}/**/*`, 'package.json'], { base: './' })
    .pipe(gulp.dest(`${buildInfo.outputDir}/`));
})

gulp.task('copyNs', function(){
  return gulp.src(['ns-localize.json'], { base: './' })
        .pipe(rename(function(path){
          path.basename ='ns';
          path.extname = ".json";
        }))
        .pipe(gulp.dest(`${buildInfo.outputDir}/`));
})

gulp.task('default', gulp.series('clean', 'copy', 'copyNs'), function(){
  return gulp.pipe(notify({ message: `代码处理完成,最终代码输出路径：${buildInfo.packageInfo}` }));
})