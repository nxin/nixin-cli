// ----------------------------------------------------------------------
// Sass
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, utils, $, _) {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        sass: require("gulp-sass"),
        autoprefixer: require("gulp-autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cssGlobbing: require('gulp-css-globbing'),
        cached: require("gulp-cached"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.sass = {
        paths: ["/styles/*.{sass,scss}"],
        opts: {
            includePaths: [],
            indentedSyntax: true,
            precision: 10,
            outputStyle: "expanded",
            importer: []
        },
        outputExt: "{css,css.map,css.gz}"
    });

    // Public Methods
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sass", function() {
            $.del(utils.setCleanStack("sass", config.app))
        });
    }

    function create() {
        gulp.task("sass", ["clean:sass"], function() {
            return gulp.src(utils.setSourceStack("sass"))
                .pipe($.cached(config.dest, {
                    extension: '.css'
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.cssGlobbing({
                    extensions: ['.scss', '.sass']
                }))
                .pipe($.sass(config.sass.opts))
                .on('error', utils.errors)
                .pipe($.autoprefixer(config.autoprefixer))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath($.path, filepath, config.app);
                }))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.cssnano(),
                    $.cssnano().pipe($.gzip())
                )))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe($.if(process.isProd, $.browserSync.reload({
                    stream: true
                })));
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
