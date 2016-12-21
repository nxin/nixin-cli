// ----------------------------------------------------------------------
// Pug
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        pug: require("gulp-pug"),
        jadeGlobbing: require("gulp-jade-globbing"),
        cached: require("gulp-cached")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.pug, {
        paths: "/**/**/*.pug",
        opts: {
            base: "markup",
            pretty: true,
            cache: true
        }
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:pug", () => {
            $.del(config.dest + "/markup/**/*.html", {
                force: true
            });
        });
    }

    function create() {
        gulp.task("pug", ["clean:pug"], () => {
            return gulp.src(config.source + config.pug.paths)
                .pipe($.cached(config.dest, {
                    extension: '.html'
                }))
                .pipe($.pug(config.pug.opts))
                .on('error', kernel.errors)
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.dest))
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
