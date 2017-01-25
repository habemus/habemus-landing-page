module.exports = function (gulp) {
  gulp.task('distribute', ['translate'], function () {
    return gulp.src('tmp-translated/**/*')
      .pipe(gulp.dest('dist'));
  });
};
