// native
const fs = require('fs');
const path = require('path');

// third-party
const nunjucks                = require('gulp-nunjucks');
const gulpData                = require('gulp-data');
const gulpIf                  = require('gulp-if');
const mergeStream             = require('merge-stream');
const gulpPrepareTranslations = require('gulp-prepare-translations');
const fse = require('fs-extra');

const SRC_DIR = path.join(__dirname, '../src');
const LEGAL_DIR = path.join(__dirname, '../legal');
const DIST_DIR = path.join(__dirname, '../tmp-translated');

function isHtml(file) {
  return /\.html$/.test(file.path);
}

function isBowerComponent(file) {
  return /bower_components/.test(file.path);
}

module.exports = function (gulp) {
  
  /**
   * Generates translated version of websites
   */
  gulp.task('translate', function () {
    
    function shouldTranslate(file) {
      return isHtml(file) && !isBowerComponent(file);
    }
    
    fse.emptyDirSync(DIST_DIR);
    
    var mainLangCode = 'en-US';
    
    var languages = fs.readdirSync(SRC_DIR + '/resources/languages')
      .filter((contentName) => {
        return /\.json$/.test(contentName)
      })
      .map((filename) => {
        
        var langCode = path.basename(filename, '.json');
        
        return {
          code: langCode,
          translations: require(SRC_DIR + '/resources/languages/' + filename),
          isMain: langCode === mainLangCode,
        };
      });

    // legal texts
    var legalTexts = {
      'en-US': {
        privacyPolicy: fs.readFileSync(SRC_DIR + '/bower_components/habemus-legal/dist/privacy-policy/en-US.html', 'utf8'),
        termsOfService: fs.readFileSync(SRC_DIR + '/bower_components/habemus-legal/dist/terms-of-service/en-US.html', 'utf8'),
      },
      'pt-BR': {
        // using en-US for pt-BR replacement
        // TODO: translate
        privacyPolicy: fs.readFileSync(SRC_DIR + '/bower_components/habemus-legal/dist/privacy-policy/en-US.html', 'utf8'),
        termsOfService: fs.readFileSync(SRC_DIR + '/bower_components/habemus-legal/dist/terms-of-service/pt-BR.html', 'utf8'),
      },
    };
    
    var translationStreams = languages.map((lang) => {
      
      var baseCompileContext = {
        siteURL: '',
        lang: lang.code,
        t: lang.translations,
        legal: legalTexts[lang.code],
      };
      
      var stream = gulp.src(SRC_DIR + '/**/*')
        .pipe(gulpData(function(file) {
          
          var compileContext = Object.assign({}, baseCompileContext, {
            file: {
              path: path.relative(SRC_DIR, file.path),
            }
          });
          
          return compileContext;
        }))
        .pipe(gulpIf(shouldTranslate, nunjucks.compile(null, {
          autoescape: false
        })));
        
      if (lang.isMain) {
        return stream.pipe(gulp.dest(DIST_DIR));
      } else {
        return stream.pipe(gulp.dest(DIST_DIR + '/' + lang.code));
      }
    });

    // // legal translation streams
    // // TODO: improve logic
    // var legalStreams = languages.map((lang) => {

    //   var stream = gulp.src(LEGAL_DIR + '/' + lang.code + '/**/*')
    //     .pipe(nunjucks.compile(null, {
    //       autoescape: false
    //     }));

    //   if (lang.isMain) {
    //     return stream.pipe(gulp.dest(DIST_DIR + '/legal'));
    //   } else {
    //     return stream.pipe(gulp.dest(DIST_DIR + '/' + lang.code + '/legal'));
    //   }
    // });
    
    return mergeStream.apply(null, translationStreams);
  });
  
  /**
   * Prepares translation files
   */
  gulp.task('prepare-translations', function () {
    
    var translatableFiles = [
      SRC_DIR + '/**/*.html',
      '!' + SRC_DIR + '/bower_components',
    ];
    
    return gulp.src(translatableFiles)
      .pipe(gulpPrepareTranslations({
        languages: [
          {
            code: 'en-US',
            src: SRC_DIR + '/resources/languages/en-US.json',
          },
          {
            code: 'pt-BR',
            src: SRC_DIR + '/resources/languages/pt-BR.json',
          }
        ],
        patterns: [
          /{{\s*([0-9a-zA-Z.]+?)\s*}}/g,
        ]
      }))
      .pipe(gulp.dest(SRC_DIR + '/resources/languages/tmp'));
  });
  
};
