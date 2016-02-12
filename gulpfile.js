'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    scssLint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    cssComb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    stylestats = require('gulp-stylestats'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    favicons = require("gulp-favicons"),
    watch = require('gulp-watch');

// SASS Task
//

var styles = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/styles/' + config.src + '.scss')
                .pipe(scssLint({
                    'config': 'scss-lint.yml',
                }));

            return sass('./assets/styles/' + config.src + '.scss', {
                    precision: 10,
                    sourcemap: true
                })
                .pipe(sourcemaps.init())
                .on('error', sass.logError)
                .pipe(autoprefixer("last 2 version", "> 1%", "ie 8", "ie 7"))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('sass', function() {
    return styles
        .compile({
            src: 'app',
            dest: 'css'
        });
});

// CSS Task
//

var css = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/css/' + config.src + '.css')
                .pipe(cssComb())
                .pipe(rename(config.rename + '.css'))
                .pipe(gulp.dest('./assets/' + config.dest))
                .pipe(cssnano({
                    compatibility: 'ie6'
                  }))
                .pipe(rename(config.rename + '.min.css'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('css', ['sass'], function() {
    return css
        .compile({
            src: 'app',
            rename: 'main',
            dest: 'css'
        });
});

// Scripts Task
//

var js = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/scripts/' + config.src + '.js')
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'))
                .pipe(rename(config.rename + '.js'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('scripts', function() {
    return js
            .compile({
                src: 'app',
                rename: 'main',
                dest: 'js'
            });
});

// Bower Components Task
//

var vendor = (function() {
    return {
        compile: function(config) {
          gulp.src('bower_components/' + config.src + config.file)
              .pipe(gulp.dest('./assets' + config.dest));

            return this;
        }
    };
}());

gulp.task('bower', function () {
    return vendor
        .compile({
            src: 'jquery/dist/',
            file: '*.js',
            dest: '/js'
        })
        .compile({
            src: 'respond/dest/',
            file: 'respond.min.js',
            dest: '/js'
        })
        .compile({
            src: 'bootstrap-sass/assets/javascripts/',
            file: '*.min.js',
            dest: '/js'
        })
        .compile({
            src: 'zoom.js/dist/',
            file: '*.min.js',
            dest: '/js'
        })
        .compile({
            src: 'font-awesome/fonts/',
            file: '*',
            dest: '/fonts'
        })
        .compile({
            src: 'font-awesome/css/',
            file: '*.min.css',
            dest: '/css'
        })
        .compile({
            src: 'zoom.js/css/',
            file: '*.css',
            dest: '/css'
        });
});

// Favicons Task
//

var icons = (function() {
    return {
        compile: function(config) {
          gulp.src('./assets/' + config.src + 'favicon.src.png')
              .pipe(favicons({
                  appName: "Paradise Unified School District Website",
                  appDescription: "District Website",
                  developerName: "Bryan Colosky",
                  developerURL: "http://studiocraft.cc",
                  background: config.background,
                  path: './assets/' + config.path,
                  url: "http://studiocraft.cc/",
                  display: "standalone",
                  orientation: "landscape",
                  version: 1.0,
                  logging: false,
                  online: false,
                  html: config.html,
                  replace: true
              }))
              .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('icons', function() {
    return icons
        .compile({
            src: 'images/favicons/',
            dest: 'images/favicons/',
            html: './_includes/favicons.html',
            path: 'images/favicons/',
            background: 'transparent'
        });

});

gulp.task('watch', function() {
  gulp.watch('assets/styles/**/*.scss', ['sass']);
  gulp.watch('assets/scripts/**/*.js', ['scripts']);
  gulp.watch('assets/images/favicons/*.src.png', ['icons']);
});

gulp.task('default', ['watch', 'sass', 'scripts', 'icons']);
