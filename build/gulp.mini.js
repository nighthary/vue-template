var gulp = require('gulp') // gulp基础包
var uglify = require('gulp-uglify') // 压缩js
var babel = require('gulp-babel')
var notify = require('gulp-notify') // 提示信息
var gulpEncrypt = require('gulp-js-encrypt')

const buildInfo = {
  outputDir: '.'
}

gulp.task('miniRoutes', function () {
  return gulp.src([`${buildInfo.outputDir}/routes/**/*.js`], { allowEmpty: true })
    .pipe(babel({
      presets: ['@babel/env']
    }))
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
    // .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/bin`))
});

gulp.task('miniService', function () {
  return gulp.src([`${buildInfo.outputDir}/service/**/*.js`], { allowEmpty: true })
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/service`))
});

gulp.task('miniUtils', function () {
  return gulp.src([`${buildInfo.outputDir}/utils/**/*.js`], { allowEmpty: true })
    .pipe(babel({ // 编译es6语法
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulpEncrypt())
    .pipe(gulp.dest(`${buildInfo.outputDir}/utils`))
});

gulp.task('mini', gulp.series('miniBin', 'miniRoutes', 'miniService', 'miniUtils'), function () {
  return gulp.pipe(notify({ message: '压缩完成' }));
})
