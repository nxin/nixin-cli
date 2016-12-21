// ----------------------------------------------------------------------
// Ionic
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        gnirts: require('gulp-gnirts')
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.ionic = {
        source: ["/ionic"],
        dest: "/ionic"
    });


    function clean(){
        gulp.task("clean:ionic", () => {
            // $.del(kernel.setCleanStack("ionic"));
        });

    }

    function create(){
        gulp.task("ionic", ["clean:ionic"], () => {
            gulp.src(kernel.setSourceStack("ionic", config.ionic.inputExt))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });

    }

    // return {
    //     clean: clean(),
    //     create: create()
    // }

};
