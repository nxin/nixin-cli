// ----------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, utils, $, _) {

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
        source: ["/images"],
        dest: "/images",
        inputExt: {
            jpeg: "{jpg,jpeg}",
            png: "png",
            gif: "gif",
            svg: "svg"
        },
        outputExt: "{gif,jpg,jpeg,png,svg}"
    });

    // Private
    // ---------------------------------------------

    function imagesJpeg() {
        gulp.task("imagesJpeg", function () {
            gulp.src(utils.setSourceStack("images", config.images.inputExt.jpeg))
                .pipe($.imagemin($.jpegtran({
                    progressive: true
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesPng() {
        gulp.task("imagesPng", function () {
            gulp.src(utils.setSourceStack("images", config.images.inputExt.png))
                .pipe($.imagemin($.pngquant({
                    quality: "65-80",
                    speed: 4
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesGif() {
        gulp.task("imagesGif", function () {
            gulp.src(utils.setSourceStack("images", config.images.inputExt.gif))
                .pipe($.imagemin($.gifsicle({
                    interlaced: true
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesSvg() {
        gulp.task("imagesSvg", function () {
            gulp.src(utils.setSourceStack("images", config.images.inputExt.svg))
                .pipe($.imagemin($.svgo({
                    removeViewBox: false
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.paths))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:images", function(){
            $.del(utils.setCleanStack("images", config.images.dest + "/"));
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
