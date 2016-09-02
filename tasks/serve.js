// ----------------------------------------------------------------------
// Serve
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Config
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign(config.serve, {
        stylus: "/**/styles/**/*.styl",
        sass: "/**/styles/**/*.{scss,sass}",
        browserify: "/**/scripts/**/*.js",
        pug: "/**/markup/**/*.{pug,jade}"
    });

    // Public Methods
    // ---------------------------------------------------------

    function watch() {
        gulp.task("serve:watch", () => {
            gulp.watch(config.source + config.serve.stylus, ["stylus"]);
            gulp.watch(config.source + config.serve.sass, ["sass"]);
            gulp.watch(config.source + config.serve.browserify, ["browserify"]);
            // gulp.watch(config.dest + config.serve.pug, $.browserSync.reload);
        });
    }

    function sync() {
        gulp.task("serve:sync", () => {
            $.browserSync.init({
                watchTask: true,
                open: 'external',
                host: config.serve.host,
                proxy: config.serve.proxy,
                port: config.serve.port,
                middleware: (req, res, next) => {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    next();
                }
            });
        });
    }

    function serve() {
        gulp.task("serve", ["serve:watch", "serve:sync"]);
    }

    // API
    // ---------------------------------------------------------

    return {
        watch: watch(),
        sync: sync(),
        serve: serve()
    };

};
