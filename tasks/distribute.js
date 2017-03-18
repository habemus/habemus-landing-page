// native
const path = require('path');

// third-party
const gulpReplace  = require('gulp-replace');
const gulpCheerio  = require('gulp-cheerio');
const gulpImagemin = require('gulp-imagemin');
const gulpCleanCss = require('gulp-clean-css');
const gulpUglify   = require('gulp-uglify');
const gulpIf       = require('gulp-if');
const gulpUseref   = require('gulp-useref');
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

// HABEMUS.IO crazy egg script
const CRAZY_EGG_SCRIPT = `<script type="text/javascript">
setTimeout(function(){var a=document.createElement("script");
var b=document.getElementsByTagName("script")[0];
a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0063/0568.js?"+Math.floor(new Date().getTime()/3600000);
a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
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
  gulp.task('distribute:prepare', ['translate', 'less'], function () {
    
    if (!process.env.H_ACCOUNT_SERVER_URI) {
      throw new Error('H_ACCOUNT_SERVER_URI env var MUST be defined');
    }
    
    fse.removeSync(path.join(__dirname, '../dist'));

    return gulp.src('tmp-translated/**/*')
      .pipe(gulpIf(isJs, gulpReplace(
        'http://localhost:9000/api/h-account/public',
        process.env.H_ACCOUNT_SERVER_URI
      )))
      // .pipe(gulpIf(isJs, gulpUglify()))
      .pipe(gulpIf(isHtml, gulpCheerio(function ($, file, done) {
        $('body').append(GA_SCRIPT);
        $('body').append(CRAZY_EGG_SCRIPT);
        done();
      })))
      .pipe(gulpIf(isCss, gulpCleanCss()))
      .pipe(gulpIf(isImage, gulpImagemin()))
      .pipe(gulp.dest('dist'));
  });

  // Generate & Inline Critical-path CSS
  gulp.task('distribute', ['distribute:prepare'], function () {
    
    var pages = ['dist/*.html', 'dist/pt-BR/*.html'];
    
    return gulp.src(pages, { base: 'dist' })
      .pipe(critical({
        base: 'dist/',
        inline: true,
        ignore: ['@font-face',/url\(/],
      }))
      // .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
      .pipe(gulp.dest('dist'));
  });
};
