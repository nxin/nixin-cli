// ----------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        imagemin: require('gulp-imagemin'),
        pngquant: require('imagemin-pngquant'),
        gifsicle: require("imagemin-gifsicle"),
        jpegtran: require("imagemin-jpegtran"),
        svgo: require("imagemin-svgo")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.images = {
        source: ["/images"],
        dest: "/images",
        inputExt: {
            jpeg: "{jpg,jpeg}",
            png: "png",
            gif: "gif",
            svg: "svg"
        },
        outputExt: "{gif,jpg,jpeg,png,svg}",
        regExt: /\.(gif|jpg|jpeg|png|svg)$/
    });


    // Public
    // ---------------------------------------------------------

    function imagesJpeg() {
        gulp.task("imagesJpeg", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.jpeg))
                .pipe($.imagemin($.jpegtran(config.imagemin.jpegtran)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesPng() {
        gulp.task("imagesPng", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.png))
                .pipe($.imagemin($.pngquant(config.imagemin.pngquant)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesGif() {
        gulp.task("imagesGif", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.gif))
                .pipe($.imagemin($.gifsicle(config.imagemin.gifsicle)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function imagesSvg() {
        gulp.task("imagesSvg", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.svg))
                .pipe($.imagemin($.svgo(config.imagemin.svgo)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function clean() {
        gulp.task("clean:images", () => {
            $.del(kernel.setCleanStack("images"));
        });
    }

    function create() {
        kernel.extendTask("images", ["clean:images"], [
            "imagesPng",
            "imagesJpeg",
            "imagesGif",
            "imagesSvg"
        ]);
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
