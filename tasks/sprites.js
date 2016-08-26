// ----------------------------------------------------------------------
// Sprite
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        spritesmith: require("spritesmith")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.sprites = {
        source: "/sprites",
        dest: "",
        inputExt: "{gif,jpg,jpeg,png,svg}",
        outputExt: "css"
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sprites", () => {
            // $.del(config.dest + '/sprites');
        });
    }

    function create(isGzip) {
        gulp.task("sprites", () => {
            gulp.src(kernel.setSourceStack("sprites", config.sprites.inputExt))
                .pipe($.spritesmith({
                    imgName: "sprite.png",
                    cssName: "sprite" + config.sprites.outputExt,
                    width: 100,
                    height: 100
                }))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                // .pipe($.if(isGzip, $.gzip()))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    return {
        clean: clean(),
        create: create()
    };
};
