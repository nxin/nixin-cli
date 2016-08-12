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
        less: require("gulp-less"),
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
    _.extend(config.less = {
        source: ["/styles"],
        dest: "",
        inputExt: "less",
        outputExt: "{css,css.map,css.gz}",
        opts: {}
    });

    // Public Methods
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:less", function() {
            $.del(utils.setCleanStack("less", config.app))
        });
    }

    function create() {
        gulp.task("less", ["clean:less"], function() {
            return gulp.src(utils.setSourceStack("less", config.stylus.inputExt))
                .pipe($.cached(config.dest, {
                    extension: '.css'
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.cssGlobbing({
                    extensions: ['.less']
                }))
                // .pipe($.less(config.less.opts))
                .pipe($.less())
                .on('error', utils.errors)
                .pipe($.autoprefixer(config.autoprefixer))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath, config.app);
                }))
                .pipe(utils.addSuffixPath())
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
