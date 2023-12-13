
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const tsify = require('tsify');
const fancy_log = require('fancy-log');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const paths = {
    files: ['src/ajax/*.*', 'src/connectors/*.*', 'src/lib/*?/*.*', 'src/templates/*.*', 'src/icons/fonts/*.*', 'src/icons/style.css']
};

const watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/file-tree-browser.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle () {
    return watchedBrowserify
        /* .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        }) */
        .bundle()
        .on('error', fancy_log)
        .pipe(source('js/file-tree-browser.js'))
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
