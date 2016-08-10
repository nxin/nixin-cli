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
        paths: "/images/*.",
        jpegExt: "{jpg,jpeg}",
        pngExt: "png",
        gifExt: "gif",
        svgExt: "svg",
        dest: "/images",
        outputExt: "{gif,jpg,jpeg,png,svg}"
    });

    // Private
    // ---------------------------------------------

    function imagesJpeg() {
        gulp.task("imagesJpeg", function () {
            gulp.src(utils.setSourceStack("images", config.images.jpegExt))
                .pipe($.imagemin($.jpegtran({
                    progressive: true
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath($.path, filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesPng() {
        gulp.task("imagesPng", function () {
            gulp.src(utils.setSourceStack("images", config.images.pngExt))
                .pipe($.imagemin($.pngquant({
                    quality: "65-80",
                    speed: 4
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath($.path, filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesGif() {
        gulp.task("imagesGif", function () {
            gulp.src(utils.setSourceStack("images", config.images.gifExt))
                .pipe($.imagemin($.gifsicle({
                    interlaced: true
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath($.path, filepath);
                }))
                .pipe(gulp.dest(config.dest + config.images.path))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesSvg() {
        gulp.task("imagesSvg", function () {
            gulp.src(utils.setSourceStack("images", config.images.svgExt))
                .pipe($.imagemin($.svgo({
                    removeViewBox: false
                })))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath($.path, filepath);
                }))
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
            $.del(utils.setCleanStack("images", "images/"));
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
