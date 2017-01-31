// third-party
const gulpReplace = require('gulp-replace');
const gulpCheerio = require('gulp-cheerio');
const gulpIf      = require('gulp-if');

// HABEMUS.IO google analytics script
const GA_SCRIPT = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71194663-5', 'auto');
  ga('send', 'pageview');

</script>`;

function isHtml(file) {
  return /\.html/.test(file.path);
}

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
      .pipe(gulpIf(isHtml, gulpCheerio(function ($, file, done) {
        $('body').append(GA_SCRIPT);
        done();
      })))
      .pipe(gulp.dest('dist'));
  });
};
