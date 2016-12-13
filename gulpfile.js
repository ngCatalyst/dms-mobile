var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var flatten = require('gulp-flatten');
var typescript = require('gulp-typescript');
var merge = require('event-stream');

gulp.task('watch', ['build'], function () {
    return gulp.watch(['src/html/*.html', ['src/typescript/*.ts']], ['build']);
});

gulp.task('compile-typescript', [], function () {
    return gulp.src(['src/typescript/*.ts']).pipe(typescript({
        noImplicitAny: true,
        target: "es5",
        out: 'output.js'
    })).pipe(concat('app.js')).pipe(gulp.dest('dist'));
});

gulp.task('copy-html-to-dist', [], function () { 
    return gulp.src(['src/html/**/.html']).pipe(gulp.dest('dist'));
});

gulp.task('inject-bower-components', [], function () {
    var components = ['src/bower_components/**/dist/*.min.js', 'src/bower_components/**/dist/js/*.min.js'];

    gulp.src(components).pipe(flatten()).pipe(gulp.dest('dist'));

    return gulp.src('src/html/index.html').pipe(inject(gulp.src(components), { transform: function (filepath, file, i, length) {
        return '<script src="' + filepath.substring(filepath.lastIndexOf('/') + 1) + '"></script>';
    }})).pipe(gulp.dest('dist'));
});

gulp.task('build', ['compile-typescript', 'copy-html-to-dist', 'inject-bower-components'], function () {
    return console.log('complete');
});