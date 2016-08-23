// ----------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, utils, $, _) => {

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.fonts = {
        source: ["/fonts"],
        dest: "/fonts",
        inputExt: "{ttf,eot,svg,woff,woff2}",
        outputExt: "{ttf,eot,svg,woff,woff2}"
    });

    // Public
    // ---------------------------------------------

    function clean() {
        gulp.task("clean:fonts", () => {
            $.del(utils.setCleanStack("fonts", config.fonts.dest + "/"));
        });
    }

    function create() {
        gulp.task("fonts", ["clean:fonts"], () => {
            gulp.src(utils.setSourceStack("fonts", config.fonts.inputExt))
                .pipe($.rename((filepath) => {
                    utils.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest + config.fonts.dest))
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
