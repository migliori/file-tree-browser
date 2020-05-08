
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var fancy_log = require('fancy-log');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    files: ['src/ajax/*.*', 'src/connectors/*.*', 'src/lib/*?/*.*', 'src/templates/*.*', 'src/icons/fonts/*.*', 'src/icons/style.css']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/file-tree.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        /* .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        }) */
        .bundle()
        .on('error', fancy_log)
        .pipe(source('js/file-tree.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

gulp.task('copy-files', function () {
    return gulp.src(paths.files, { base: 'src' })
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series(gulp.parallel('copy-files'), bundle));

watchedBrowserify.on('update', gulp.series(gulp.parallel('copy-files'), bundle));
watchedBrowserify.on('log', fancy_log);
