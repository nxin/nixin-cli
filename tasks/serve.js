// ----------------------------------------------------------------------
// Serve
// ----------------------------------------------------------------------


module.exports = (gulp, config, kernel, $) => {

    'use strict';

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

    let watch = () => {
        gulp.task("serve:watch", () => {
            gulp.watch(config.source + config.serve.stylus, ["stylus"]);
            gulp.watch(config.source + config.serve.sass, ["sass"]);
            gulp.watch(config.source + config.serve.browserify, ["browserify"]);
            // gulp.watch(config.destPublicDir + config.dest + config.serve.pug, $.browserSync.reload);
        });
    };

    let sync = () => {
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
    };

    let serve = () => {
        gulp.task("serve", ["serve:watch", "serve:sync"]);
    };

    // API
    // ---------------------------------------------------------

    return {
        watch: watch(),
        sync: sync(),
        serve: serve()
    };

};
