// ----------------------------------------------------------------------
// Sass
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

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
        }
    });

    // Public Methods
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sass", function() {
            $.del(config.dest + "/" + config.app + ".{css,css.map,css.gz}", {
                force: true
            });
        });
    }

    function create() {
        gulp.task("create:sass", ["clean:sass"], function() {
            return gulp.src(config.source + config.sass.paths)
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
                .pipe($.rename({
                    basename: config.app
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
