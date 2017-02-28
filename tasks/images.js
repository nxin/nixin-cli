// ----------------------------------------------------------------------
// Images
// ----------------------------------------------------------------------


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
        svgo: require("imagemin-svgo"),
        imageMagick: require("gm"),
        imageResize: require("gulp-image-resize")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.images = {
        source: ["/" + config.images],
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
        gulp.task("create:images.jpeg", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.jpeg))
                .pipe($.imagemin($.jpegtran(config.imagemin.jpegtran)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));
        });
    }

    function imagesPng() {
        gulp.task("create:images.png", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.png))
                .pipe($.imagemin($.pngquant(config.imagemin.pngquant)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));

        });
    }

    function imagesGif() {
        gulp.task("create:images.gif", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.gif))
                .pipe($.imagemin($.gifsicle(config.imagemin.gifsicle)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));
        });
    }

    function imagesSvg() {
        gulp.task("create:images.svg", () => {
            gulp.src(kernel.setSourceStack("images", config.images.inputExt.svg))
                .pipe($.imagemin($.svgo(config.imagemin.svgo)))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));
        });
    }

    function imagesResize() {
        let sizes = {
            "xs": 128,
            "sm": 256,
            "md": 512,
            "lg": 1024,
            "xl": 2048
        };

        gulp.task("create:images.resize", () => {
            for (let key in sizes) {
                // skip loop if the property is from prototype
                if (!sizes.hasOwnProperty(key)) continue;

                let size = sizes[key];

                gulp.src(config.source + "/resizeOrigin/" + "**/*.{png,jpg,gif}")
                    .pipe($.imageResize({
                        width: size,
                        crop: false,
                        upscale: true
                    }))
                    .pipe($.rename({
                        suffix: "--" + key
                    }))
                    .pipe($.size({
                        showFiles: true
                    }))
                    .pipe(gulp.dest(config.source + "/images/resized"));
            }
        });
    }

    function clean() {
        gulp.task("clean:images", () => {
            $.del(kernel.setCleanStack("images"));
        });
    }

    function create() {
        // imagesResize((() => {
            kernel.extendTask("images", ["clean:images"], ["create:images.png", "create:images.jpeg", "create:images.gif", "create:images.svg"]);
        // })());
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create(),
        imagesPng: imagesPng(),
        imagesJpeg: imagesJpeg(),
        imagesGif: imagesGif(),
        imagesSvg: imagesSvg(),
        imagesResize: imagesResize()
    };

};
