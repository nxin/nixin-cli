// ----------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------


module.exports = (gulp, config, kernel, $) => {

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.fonts = {
        source: ["/" + config.fonts],
        dest: "/fonts",
        inputExt: "{ttf,eot,woff,woff2}",
        outputExt: "{ttf,eot,woff,woff2}",
        regExt: /\.(ttf|eot|woff|woff2)$/
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
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
