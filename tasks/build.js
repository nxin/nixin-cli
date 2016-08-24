// ----------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $, _) => {

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:build", () => {
            $.del(config.dest, {force: "true"});
        });
    }

    function create() {
        kernel.extendTask("build", ["bower"], [
            "browserify",
            "stylus",
            "sass",
            "fonts",
            "images"
        ]);
    }

    function watch() {
        gulp.task("watch:build", ["build", "serve:watch"]);
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create(),
        watch: watch()
    };

};
