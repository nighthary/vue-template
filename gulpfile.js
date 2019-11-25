var gulp = require('gulp') // gulp基础包
var uglify = require('gulp-uglify') // 压缩js
var babel = require('gulp-babel')
var clean = require('gulp-clean')
var notify = require('gulp-notify') // 提示信息
var gulpEncrypt = require('gulp-js-encrypt')

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

gulp.task('miniRoutes', function () {
  return gulp.src([`${buildInfo.outputDir}/routes/**/*.js`], { allowEmpty: true })
    .pipe(babel())
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/routes`))
})

gulp.task('miniBin', function () {
  return gulp.src([`${buildInfo.outputDir}/bin/*.js`], { allowEmpty: true })
    .pipe(babel({
      presets: ['@babel/env']
    }))
    // .pipe(uglify({
    //   mangle: false,
    //   compress: false
    // }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/bin`))
});

gulp.task('miniService', function () {
  return gulp.src([`${buildInfo.outputDir}/service/**/*.js`], { allowEmpty: true })
    .pipe(babel())
    // .pipe(uglify({
    //   mangle: true,
    //   compress: true
    // }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/service`))
});

gulp.task('miniUtils', function () {
  return gulp.src([`${buildInfo.outputDir}/utils/**/*.js`], { allowEmpty: true })
    .pipe(babel({ // 编译es6语法
      presets: ['@babel/env'],
      plugins: []
    }))
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/utils`))
});

gulp.task('copyUtils', function(){
  return gulp.src('utils/**')
        .pipe(gulp.dest(`${buildInfo.outputDir}/utils`))
})

gulp.task('copyBin', function(){
  return gulp.src('bin/**')
        .pipe(gulp.dest(`${buildInfo.outputDir}/bin`))
})

gulp.task('copyRoutes', function(){
  return gulp.src('routes/**')
        .pipe(gulp.dest(`${buildInfo.outputDir}/routes`))
})

gulp.task('copyService', function(){
  return gulp.src('service/**')
        .pipe(gulp.dest(`${buildInfo.outputDir}/service`))
})

gulp.task('copyNode', gulp.series('copyBin', 'copyUtils', 'copyRoutes', 'copyService'))

gulp.task('copyFront', function () {
  return gulp.src([`${packageInfo.buildPath}/**/*`])
    .pipe(gulp.dest(`${buildInfo.outputDir}/${packageInfo.buildPath}`));
})

gulp.task('copyBase', function () {
  return gulp.src(['config.json', 'package.json', 'start.js', 'ns.json'])
    .pipe(gulp.dest(`${buildInfo.outputDir}/`));
})
gulp.task('copyNodeModule', function () {
  return gulp.src(['node_modules/**/*'])
    .pipe(gulp.dest(`${buildInfo.outputDir}/node_modules`));
})

gulp.task('copy', gulp.series('copyBase', 'copyNode', 'copyFront', 'copyNodeModule'))
gulp.task('mini', gulp.series('miniBin', 'miniRoutes', 'miniService', 'miniUtils'))

gulp.task('default', gulp.series('clean', 'copy', 'mini'), function () {
  return gulp.pipe(notify({ message: '压缩完成' }));
})
