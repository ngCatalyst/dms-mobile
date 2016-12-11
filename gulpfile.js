var gulp = require('gulp');
var typescript = require('gulp-typescript');
var project = typescript.createProject('tsconfig.json');

gulp.task('watch', [], function () {
    return gulp.watch(['src/html/*.html', ['src/typescript/*.ts']], ['testing']);
});

gulp.task('testing', [], function () {
    return project.src().pipe(project()).js.pipe(gulp.dest('dist'));
});