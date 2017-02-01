// native
const path = require('path');

// third-party
const gulpReplace  = require('gulp-replace');
const gulpCheerio  = require('gulp-cheerio');
const gulpImagemin = require('gulp-imagemin');
const gulpCleanCss = require('gulp-clean-css');
const gulpIf       = require('gulp-if');
const critical     = require('critical').stream;
const fse          = require('fs-extra');

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
  return /\.html$/.test(file.path);
}

function isJs(file) {
  return /\.js$/.test(file.path);
}

function isImage(file) {
  return (/\.(gif|jpe?g|png|svg)$/i).test(file.path);
}

function isCss(file) {
  return /\.css$/.test(file.path);
}

module.exports = function (gulp) {
  gulp.task('distribute', ['translate'], function () {
    
    if (!process.env.H_ACCOUNT_SERVER_URI) {
      throw new Error('H_ACCOUNT_SERVER_URI env var MUST be defined');
    }
    
    fse.removeSync(path.join(__dirname, '../dist'));

    return gulp.src('tmp-translated/**/*')
      .pipe(gulpIf(isJs, gulpReplace(
        'http://localhost:9000/api/h-account/public',
        process.env.H_ACCOUNT_SERVER_URI
      )))
      .pipe(gulpIf(isHtml, gulpCheerio(function ($, file, done) {
        $('body').append(GA_SCRIPT);
        done();
      })))
      .pipe(gulpIf(isCss, gulpCleanCss()))
      .pipe(gulpIf(isImage, gulpImagemin()))
      .pipe(gulp.dest('dist'));
  });

  // Generate & Inline Critical-path CSS
  gulp.task('critical', ['distribute'], function () {
    return gulp.src('dist/*.html')
      .pipe(critical({
        base: 'dist/',
        inline: true,
        ignore: ['@font-face',/url\(/],
      }))
      // .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
      .pipe(gulp.dest('dist'));
  });
};
