const gulp = require('gulp')
const browserSync = require('browser-sync')
const del = require('del')
// 用于仅传递比相应的目标文件更新的源文件。
const newer = require('gulp-newer')
// css自动前缀
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
// 替换链接
const revCollector = require('gulp-rev-collector')
// 任务执行器
const runSequence = require('run-sequence')
const gulpLoadPlugins = require('gulp-load-plugins')
const $ = gulpLoadPlugins()

// 高频防抖
function debounce (func, wait) {
  var clock = null;
  wait = ~~wait
  return function(){
      var context = this,
          args = arguments;
      if (wait === 0) {
          // console.log("wait: ", wait)
          return func.apply(context, args)
      }
      var call = !clock
      // console.log(clock, wait)
      if (!clock && wait > 0) {
          clearTimeout(clock)
          clock = setTimeout(function () {
              clock = null
          }, wait)
      }
      if (call) func.apply(context, args)
  };
}

var refreshFun = debounce(() => {
  browserSync.reload()
}, 1000)

// 刷新
gulp.task('refresh', () => {
    // browserSync.notify("Compiling, please wait!");
    refreshFun()
})



gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}))
gulp.task('clean:.tmp', () => del(['.tmp'], {dot: true}))
gulp.task('clean:dist', () => del(['dist/*'], {dot: true}))

gulp.task('watch', () => {
    gulp.watch(['src/**/*.html'], ['refresh'])
    gulp.watch(['src/css/*.css'], ['refresh'])
    gulp.watch(['src/**/*.js'], ['refresh'])
    gulp.watch(['src/imgs/*'], ['refresh'])
})


gulp.task('serve', () => {
    browserSync({
        notify: false,
        logPrefix: 'i',
        // 允许滚动在断点之间同步
        scrollElementMapping: ['main', '.mdl-layout'],
        // https: true,
        server: ['src'],
        port: 3003
    })

    runSequence(['watch'])
})
gulp.task('serve:dist', ['build'], () => {
    browserSync({
        notify: false,
        logPrefix: 'i',
        // 允许滚动在断点之间同步
        scrollElementMapping: ['main', '.mdl-layout'],
        // https: true,
        server: ['dist'],
        port: 3002
    }) 
})

gulp.task('build', ['clean'], () => {
    runSequence(['build:css', 'build:js', 'build:img'], () => {
        runSequence('build:html')
    })
})

gulp.task('default', () => {
    runSequence(['serve'])
})


