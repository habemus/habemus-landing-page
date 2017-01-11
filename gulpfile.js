var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');


gulp.task('less', function () {
  var srcLess = [
    './src/less/pages/**/index.less',
    './src/less/pages/*.less'
  ];
  
  return gulp.src(srcLess) //gera fonte de arquivos
    .pipe(less({ //pega a fonte e joga em algum lugar - less é um cano com engrenagens dentro
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./src/css')); //dest é para onde vão as coisas. a pasta
});


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });

    gulp.watch("src/less/**/*.less", ['less']); //1 arg: assiste a isso, 2 arg: executa essa lista de tasks

    gulp.watch(["src/**/*.html", 'src/**/*.css', 'src/**/*.js'], browserSync.reload);
});

require('./tasks/translate')(gulp);
