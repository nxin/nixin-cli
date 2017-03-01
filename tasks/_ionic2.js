// ----------------------------------------------------------------------
// Ionic2
// ----------------------------------------------------------------------


import gnirts from 'gulp-gnirts';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.ionic = {
        source: ["/ionic"],
        dest: "/ionic"
    });


    let clean = () => {
        gulp.task("clean:ionic", () => {
            // $.del(kernel.setCleanStack("ionic"));
        });
    };

    let create = () => {
        gulp.task("ionic", ["clean:ionic"], () => {
            gulp.src(kernel.setSourceStack("ionic", config.ionic.inputExt))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    };

    // return {
    //     clean: clean(),
    //     create: create()
    // }

};
