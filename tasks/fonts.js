// ----------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.fonts = {
        path: "/fonts",
        ext: "{ttf,eot,svg,woff,woff2}"
    });

    // Public
    // ---------------------------------------------

    function clean() {
        gulp.task("clean:fonts", function(){
            $.del(config.dest + config.fonts.path + "/*." + config.fonts.ext);
        });
    }

    function create() {
        gulp.task("fonts", ["clean:fonts"], function() {
            gulp.src(config.source + config.fonts.path + "/*." + config.fonts.ext)
                .pipe(gulp.dest(config.dest + config.fonts.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
