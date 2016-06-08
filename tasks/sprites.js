// ----------------------------------------------------------------------
// Sprite
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        spritesmith: require("spritesmith")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.images = {
        path: "/sprites",
        imagesExt: "{gif,jpg,jpeg,png,svg,cur}",
        spriteExt: "{css,scss,sass,less,gif,jpg,jpeg,png,svg}"
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sprites", function() {
            $.del(config.dest + '/sprites');
        });
    }

    function create(isGzip) {
        gulp.task("sprites", function() {
            gulp.src(config.source + config.images.path + "/sprite/*")
                .pipe($.spritesmith({
                    imgName: "sprite.png",
                    cssName: "sprite.css",
                    width: 100,
                    height: 100
                }))
                .pipe($.rename({
                    dirname: "sprite"
                }))
                .pipe($.if(isGzip, $.gzip()))
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
