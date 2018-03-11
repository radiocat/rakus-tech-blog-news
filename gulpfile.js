var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('pre-test', function () {
    return gulp.src(['*.js'])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
    return gulp.src('./test/**/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 25 } }));
});

