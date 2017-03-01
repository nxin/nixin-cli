// ----------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------


module.exports = (gulp, config, kernel, $, _) => {

    'use strict';

    // Public
    // ---------------------------------------------------------

    let clean = () => {
        gulp.task("clean:build", () => {
            $.del(config.destPublicDir + config.dest, {force: "true"});
        });
    };

    let create = () => {
        kernel.extendTask("build", ["bower"], [
            "browserify",
            "stylus",
            "sass",
            "fonts",
            "images"
        ]);
    };

    let watch = () => {
        gulp.task("watch:build", ["build", "serve:watch"]);
    };

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create(),
        watch: watch()
    };

};
