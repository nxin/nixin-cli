// ----------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $, _) => {

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.fonts = {
        source: ["/fonts"],
        dest: "/fonts",
        inputExt: "{ttf,eot,svg,woff,woff2}",
        outputExt: "{ttf,eot,svg,woff,woff2}",
        regExt: /\.(ttf|eot|svg|woff|woff2)$/
    });

    // Public
    // ---------------------------------------------

    function clean() {
        gulp.task("clean:fonts", () => {
            $.del(kernel.setCleanStack("fonts"));
        });
    }

    function create() {
        gulp.task("fonts", ["clean:fonts"], () => {
            gulp.src(kernel.setSourceStack("fonts", config.fonts.inputExt))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
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
