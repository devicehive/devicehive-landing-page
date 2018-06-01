require('es6-promise').polyfill();

var confGlobal = require('./gulp/config/gulp-global.json');
var confPlugins = require('./gulp/config/gulp-plugins.json');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var del = require('del');
var pngquant = require('imagemin-pngquant');

gulp.task('default', function() {
  gulp.watch(['dev']);
});

gulp.task('dev', function(){
  confGlobal.isDevelop = true;
  runSequence('watch', 'hugo:server');
});

gulp.task('dev:nowatch', function(){
  confGlobal.isDevelop = true;
  runSequence(['js','css','copy:assets'], 'hugo:server:nowatch');
});

gulp.task('prod', function(){
    confGlobal.isDevelop = false;
	runSequence('clean', ['js','css','copy:assets:minify', 'copy:preloader'], 'css:clean', 'hugo:build');
});

gulp.task('js', function(){

    var sourcemaps = require('gulp-sourcemaps');

    return gulp.src('./source/**/*.js')
      .pipe(plugins.plumber({ handleError: function(err) { console.log(err); this.emit('end'); } }))
      .pipe(sourcemaps.init())
      .pipe(plugins.jshint(confPlugins.jshintOptions))
      .pipe(plugins.concat('main.min.js'))
      .pipe(gulpif(!confGlobal.isDevelop, plugins.uglify({ mangle: true })))
      .pipe(gulpif(!confGlobal.isDevelop, plugins.stripDebug()))
      .pipe(gulpif(confGlobal.enableGZIP, plugins.gzip(confPlugins.gzipOptions)))
      .pipe(gulp.dest('./static/js/'));
});

gulp.task('css', function(){
    var autoprefixer = require('autoprefixer');
    var cssgrace = require('cssgrace');
    var pseudoelements = require('postcss-pseudoelements');
	var cssnano = require('cssnano');

    var processors = [
      autoprefixer(confPlugins.autoprefixer),
      //cssgrace,
      pseudoelements
    ];

	if (!confGlobal.isDevelop) {
		processors = [
		  autoprefixer(confPlugins.autoprefixer),
		  //cssgrace,
		  pseudoelements,
		  cssnano
		 ];
	 }
console.log('---', 'css -----');
	return gulp.src('./source/scss/**/*.scss')
      .pipe(plugins.plumber({ handleError: function(err) { console.log(err); this.emit('end'); } }))
      .pipe(plugins.sass())
      .pipe(plugins.postcss(processors))
      .pipe(gulp.dest('./static/css/'));
});

gulp.task('css:clean', function(){
	console.log('Removing unused css styles...');
	return gulp.src('./public/css/main.css')
      .pipe(gulpif(!confGlobal.isDevelop, plugins.uncss({ html: './public/**/*.html' })))
      .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function(){

    gulp.watch('./source/scss/**/*.scss', function() {
        console.log('Scss file changed, processing css...');
        gulp.run('css');
    });

    plugins.watch('./source/js/**/*.js', function() {
	  console.log('Javascript file changed, processing js...');
      gulp.run('js');
    });

});

gulp.task('copy:assets', function(){
	return gulp.src(['./source/**/*.*','!./source/js/*.*','!./source/scss/**/*.*'])
      .pipe(gulp.dest('./static/'));
});

gulp.task('copy:preloader', function () {
    return gulp.src(['./source/img/preloader.svg'])
        .pipe(gulp.dest('./static/img'));
});

gulp.task('copy:assets:minify', function(){
	return gulp.src(['./source/**/*.*', '!./source/img/preloader.svg', '!./source/js/*.*','!./source/css/*.*', '!./source/scss/**/*.*'])
      .pipe(gulpif(!confGlobal.isDevelop, plugins.imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
      }))) // Minify only on prod
      .pipe(gulp.dest('./static/'));
});

gulp.task('clean', function(){
	console.log('Deleting public folder...');
    return del('./public/');
});

gulp.task('hugo:server', plugins.shell.task([
    'hugo server -D'
]));

gulp.task('hugo:server:nowatch', plugins.shell.task([
    'hugo server -w=false'
]));

gulp.task('hugo:build', plugins.shell.task([
    'hugo'
]));





