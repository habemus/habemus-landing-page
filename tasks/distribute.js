// third-party
const gulpReplace = require('gulp-replace');

module.exports = function (gulp) {
  gulp.task('distribute', ['translate'], function () {
    
    if (!process.env.H_ACCOUNT_SERVER_URI) {
      throw new Error('H_ACCOUNT_SERVER_URI env var MUST be defined');
    }
    
    return gulp.src('tmp-translated/**/*')
      .pipe(gulpReplace(
        'http://localhost:9000/api/h-account/public',
        process.env.H_ACCOUNT_SERVER_URI
      ))
      .pipe(gulp.dest('dist'));
  });
};
