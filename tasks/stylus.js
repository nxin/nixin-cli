// ----------------------------------------------------------------------
// Stylus
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, routes, utils, $, _) {

    // --- Dependencies -------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        stylus: require("gulp-stylus"),
        autoprefixer: require("gulp-autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cached: require("gulp-cached"),
        gzip: require("gulp-gzip"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano"),
        groupMq: require("gulp-group-css-media-queries"),
        postcss: require("postcss")
    });

    // --- Config -------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    var plugins = [].concat(config.npm.stylus);

    // extending default config with project config
    _.extend(config.stylus = {
        paths: ["/styles/*.styl"],
        opts: {
            import: [],
            use: plugins,
            "include css": true,
            compress: process.isProd,
            comment: !process.isProd
        }
    });

    // --- Public -------------------------------------------------------

    function clean() {
        gulp.task("clean:stylus", function () {
            $.del(config.dest + "/" + config.app + ".{css,css.map,css.gz}");
        });
    }

    // function stylus() {
    //     gulp.task("stylus", ["clean:stylus"], function (cb) {
    //
    //         function getPath(theme, context) {
    //             var pathTheme = "/" + theme;
    //             var pathContext = "/" + context;
    //
    //             return (pathTheme + pathContext);
    //         }
    //
    //         config.themes.map(function (theme) {
    //             config.contexts.map(function (context) {
    //
    //                 return gulp.src(config.source + getPath(theme, context) + config.stylus.paths)
    //                     .pipe($.cached(config.dest, {
    //                         extension: ".css"
    //                     }))
    //                     .pipe($.buffer())
    //                     .pipe($.sourcemaps.init({loadMaps: true}))
    //                     .pipe($.stylus(config.stylus.opts), function (res) {
    //                         $.gutil.log("in result");
    //                         console.log(res);
    //                         res.on("end", function () {
    //                             console.log('res.end');
    //                             cb();
    //                         });
    //                         res.on("data", function () {
    //                             console.log("res.data");
    //                         });
    //                     }).on("error", function (e) {
    //                         $.gutil.log("in error");
    //                         cb(e);
    //                     })
    //                     .pipe($.if(process.isProd, $.stylus(config.stylus.opts)))
    //                     .pipe($.autoprefixer(config.autoprefixer))
    //                     .pipe($.rename({
    //                         basename: config.app
    //                     }))
    //                     .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
    //                     .pipe($.if(process.isProd, $.mirror(
    //                         $.cssnano(),
    //                         $.cssnano().pipe($.gzip())
    //                     )))
    //                     .pipe($.flatten())
    //                     .pipe($.rename({
    //                         suffix: "." + theme + "." + context
    //                     }))
    //                     .pipe(gulp.dest(config.dest))
    //                     .pipe($.size({
    //                         showFiles: true
    //                     }))
    //                     .pipe($.browserSync.reload({
    //                         stream: true
    //                     }));
    //             });
    //         });
    //
    //     });
    // }


    function stylus() {
        gulp.task("stylus", ["clean:stylus"], function (cb) {

            return gulp.src(config.source + config.stylus.paths)
                .pipe($.cached(config.dest, {
                    extension: ".css"
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.stylus(config.stylus.opts), function (res) {
                    $.gutil.log("in result");
                    console.log(res);
                    res.on("end", function () {
                        console.log('res.end');
                        cb();
                    });
                    res.on("data", function () {
                        console.log("res.data");
                    });
                }).on("error", function (e) {
                    $.gutil.log("in error");
                    cb(e);
                })
                .pipe($.if(process.isProd, $.stylus(config.stylus.opts)))
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
                .pipe($.browserSync.reload({
                    stream: true
                }));
        });
    }

    function create() {
        gulp.task("css", function (cb) {
            return gulp.src(config.dest + "/app.css")
                .pipe($.groupMq())
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    // --- API ----------------------------------------------------------

    return {
        clean: clean(),
        stylus: stylus(),
        create: create()
    };

};
