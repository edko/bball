var gulp = require('gulp'), 
	gulputil = require('gulp-util'),
	concat = require('gulp-concat')

var jsSources = [
	'node_modules/angular/angular.js',
	'node_modules/angular-ui-router/release/angular-ui-router.js'
]

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(gulp.dest('testbuild/js'))
})