// ----------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        imagemin: require('gulp-imagemin'),
        pngquant: require('imagemin-pngquant'),
        gifsicle: require("imagemin-gifsicle"),
        jpegtran: require("imagemin-jpegtran"),
        svgo: require("imagemin-svgo")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.images = {
        path: "/images",
        imagesExt: "{gif,jpg,jpeg,png,svg}",
        spriteExt: "{css,scss,sass,less,gif,jpg,jpeg,png,svg}"
    });

    // Private
    // ---------------------------------------------

    function imagesJpeg() {
        gulp.task("imagesJpeg", function () {
            gulp.src([
                config.source + config.images.path + "/**/*." + "{jpg,jpeg}",
                "!" + config.source + "/sprite/*"
            ])
                .pipe($.imagemin($.jpegtran({
                    progressive: true
                })))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesPng() {
        gulp.task("imagesPng", function () {
            gulp.src([
                config.source + config.images.path + "/**/*." + "png",
                "!" + config.source + "/sprite/*"
            ])
                .pipe($.imagemin($.pngquant({
                    quality: "65-80",
                    speed: 4
                })))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesGif() {
        gulp.task("imagesGif", function () {
            gulp.src([
                config.source + config.images.path + "/**/*." + "gif",
                "!" + config.source + "/sprite/*"
            ])
                .pipe($.imagemin($.gifsicle({
                    interlaced: true
                })))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesSvg() {
        gulp.task("imagesSvg", function () {
            gulp.src([
                config.source + config.images.path + "/**/*." + "svg",
                "!" + config.source + "/sprite/*"
            ])
                .pipe($.imagemin($.svgo({
                    removeViewBox: false
                })))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:images", function(){
            $.del(config.dest + '/images/**');
        });
    }

    function create() {
        gulp.task("images", ["clean:images"], function () {
            $.runSequence([
                "imagesPng",
                "imagesJpeg",
                "imagesGif",
                "imagesSvg"
            ]);
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create(),
        imagesPng: imagesPng(),
        imagesJpeg: imagesJpeg(),
        imagesGif: imagesGif(),
        imagesSvg: imagesSvg()
    };

};
