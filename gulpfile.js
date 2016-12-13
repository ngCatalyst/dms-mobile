var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var flatten = require('gulp-flatten');
var typescript = require('gulp-typescript');
var webserver = require('gulp-webserver');
var order = require('gulp-order');
var merge = require('event-stream');

gulp.task('watch', ['build', 'webserver'], function () {
    return gulp.watch(['src/html/*.html', 'src/typescript/*.ts', 'src/css/*.css', 'src/images/*.jpeg', 'src/images/*.jpg'], ['build']);
});

gulp.task('compile-typescript', [], function () {
    return gulp.src(['src/typescript/*.ts']).pipe(typescript({
        noImplicitAny: true,
        target: "es5",
        out: 'output.js'
    })).pipe(concat('app.js')).pipe(gulp.dest('dist/app'));
});

gulp.task('copy-html-to-dist', [], function () { 
    return gulp.src(['src/html/**/.html', 'src/css/*.css']).pipe(gulp.dest('dist/app'));
});

gulp.task('inject-bower-components', [], function () {
    var components = ['src/bower_components/**/*.min.js', 'src/bower_components/**/dist/*.min.js', 'src/bower_components/**/dist/js/*.min.js', 'src/bower_components/**/dist/css/*.min.css', '!src/bower_components/bootstrap/dist/css/bootstrap-theme.min.css', 'src/bower_components/**/css/*.min.css'];

    gulp.src(components).pipe(order(components)).pipe(flatten()).pipe(gulp.dest('dist/app'));

    return gulp.src('src/html/index.html').pipe(inject(gulp.src(components), { transform: function (filepath, file, i, length) {
        var isJs = filepath.endsWith('js');
        return (filepath.endsWith('js')) ? '<script src="' + filepath.substring(filepath.lastIndexOf('/') + 1) + '"></script>' : '<link rel="stylesheet" type="text/css" href="' + filepath.substring((filepath.lastIndexOf('/') + 1)) + '" />';
    }})).pipe(gulp.dest('dist/app'));
});

gulp.task('copy-fonts', [], function () {
    return gulp.src(['src/bower_components/**/fonts/**.otf', 'src/bower_components/**/fonts/**.eot', 'src/bower_components/**/fonts/**.svg', 'src/bower_components/**/fonts/**.ttf', 'src/bower_components/**/fonts/**.woff', 'src/bower_components/**/fonts/**.woff2'])
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-images', [], function () {
    return gulp.src(['src/images/*.jpeg', 'src/images/*.jpg']).pipe(flatten()).pipe(gulp.dest('dist/app'));
});

gulp.task('webserver', [], function () {
    gulp.src('dist').pipe(webserver({
        livereload: true,
        port: 9000
    }));
});

gulp.task('build', ['compile-typescript', 'copy-html-to-dist', 'inject-bower-components', 'copy-fonts', 'copy-images'], function () {
    return console.log('complete');
});