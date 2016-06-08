// ----------------------------------------------------------------------
// Build
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean", function(){
            $.del(config.dest, {force: "true"});
        });
    }

    function build() {
        gulp.task("build", ["bower"], function(){
            $.runSequence(["browserify", "stylus", "pug", "fonts", "images"]);
        });
    }

    function buildServe() {
        gulp.task("build:serve", ["build","serve"]);
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        build: build(),
        buildServe: buildServe()
    };

};
