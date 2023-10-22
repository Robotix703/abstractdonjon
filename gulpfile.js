const gulp = require('gulp');
const zip = require('gulp-zip');
const less = require('gulp-less');
const del = require('del');

function clean() {
	return del('build/**', {force:true});
}

function copyForZip() {
	return gulp.src(['**/*', '!build/*', '!build', '!node_modules/**/*', '!node_modules', '!./gulpfile.js', '!LICENSE', '!package.json', '!package-lock.json', '!.gitignore'])
		.pipe(gulp.dest('build'))
}

function compileLESS() {
  	return gulp.src("styles/stargatecoalition.less")
		.pipe(less())
		.pipe(gulp.dest("./styles/"))
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
	clean,
	compileLESS,
	copyForZip
);