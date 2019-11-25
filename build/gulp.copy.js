var gulp = require('gulp') // gulp基础包
var clean = require('gulp-clean')
var notify = require('gulp-notify') // 提示信息

const packageInfo = require('./package.json')

const buildInfo = {
  outputDir: packageInfo.buildPath + '-dist'
}

/**
 * 清空目标目录
 */
gulp.task('clean', function () {
  return gulp.src([`${buildInfo.outputDir}`], {
    allowEmpty: true
  }).pipe(clean())
})

gulp.task('copyUtils', function () {
  return gulp.src(['utils/**', 'bin/**', 'routes/**', 'service/**'], { base: './' })
    .pipe(gulp.dest(`${buildInfo.outputDir}/`))
})

gulp.task('copyNode', gulp.series('copyUtils'))

gulp.task('copyFront', function () {
  return gulp.src([`${packageInfo.buildPath}/**/*`])
    .pipe(gulp.dest(`${buildInfo.outputDir}/${packageInfo.buildPath}`));
})

gulp.task('copyBase', function () {
  return gulp.src(['config.json', 'package.json', 'start.js', 'ns.json'])
    .pipe(gulp.dest(`${buildInfo.outputDir}/`));
})

gulp.task('copyGulp', function () {
  return gulp.src(['./build/gulp.mini.js'])
    .pipe(gulp.dest(`${buildInfo.outputDir}/gulpfile.js`));
})

gulp.task('copyNodeModule', function () {
  return gulp.src(['node_modules/**/*'])
    .pipe(gulp.dest(`${buildInfo.outputDir}/node_modules`));
})

gulp.task('copy', gulp.series('clean',  'copyBase', 'copyNode', 'copyFront', 'copyGulp','copyNodeModule'), function () {
  return gulp.pipe(notify({ message: '拷贝完成' }));
})