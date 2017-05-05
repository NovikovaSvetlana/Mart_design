var gulp = require('gulp');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var htmlincluder = require('gulp-htmlincluder');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');

gulp.task('server', function(){
    connect.server({
        root: 'build/',
        livereload: true
    });
})

gulp.task('less', function () {
  	gulp.src('./dev/assets/less/*.less')
  		.pipe(sourcemaps.init())
  		.pipe(less())
        // .pipe(csso({
        //     restructure: false
        // }))
        .pipe(rename({
            dirname: 'css'
        }))
  		.pipe(sourcemaps.write())
  		.pipe(gulp.dest('./build/'))
  		.pipe(connect.reload());
});

gulp.task('html', function(){
	gulp.src('./dev/**/*.html')
  		.pipe(htmlincluder())
        .pipe(rename({
            dirname: ''
        }))
  		.pipe(gulp.dest('./build/'))
  		.pipe(connect.reload());
})

gulp.task('moveFiles', function(){
    gulp.src('./dev/assets/img/*.*').pipe(gulp.dest('./build/img'));
    gulp.src('./dev/assets/img/collection/*.*').pipe(gulp.dest('./build/img/collection'));
    gulp.src('./dev/assets/img/featured/*.*').pipe(gulp.dest('./build/img/featured'));
    gulp.src('./dev/**/*.js').pipe(rename({
        dirname: ''
    })).pipe(gulp.dest('./build/js'));
    gulp.src('./dev/assets/fonts/**/*.*').pipe(gulp.dest('./build/fonts'));
})

gulp.task('sprite', function(){
    var sprite = gulp.src('./dev/assets/img/icons/*.png').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: '_sprite.less',
        cssFormat: 'less',
        algorithm: 'binary-tree',
        padding: 10
    }));
    sprite.img.pipe(rename('sprite.png')).pipe(gulp.dest('./build/img/'));
    sprite.css.pipe(gulp.dest('dev/assets/less/imports/'));
})



gulp.task('default', function(){
	gulp.start(['server', 'html', 'less', 'moveFiles']);

	gulp.watch(['./dev/**/*.less'], function(){
		gulp.start(['less']);
	});
	gulp.watch(['./dev/**/*.html'], function(){
		gulp.start(['html']);
	});
})