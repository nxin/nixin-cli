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
        imagemin: require("imagemin"),
        gifsicle: require("imagemin-gifsicle"),
        jpegtran: require("imagemin-jpegtran"),
        optipng: require("imagemin-optipng"),
        svgo: require("imagemin-svgo"),
        pngquant: require("imagemin-pngquant")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.images = {
        path: "/images",
        imagesExt: "{gif,jpg,jpeg,png,svg,cur}",
        spriteExt: "{css,scss,sass,less,gif,jpg,jpeg,png,svg}"
    });

    // Private
    // ---------------------------------------------

    function images(ext, plugin, option) {
        new $.imagemin()
            .src([
                config.source + config.images.path + '/**/*.' + ext,
                '!' + config.source + '/sprite/*'
            ])
            .use($.rename({
                dirname: 'images'
            }))
            .dest(config.dest)
            .use(plugin(option))
            .use($.size({
                showFiles: true
            }))
            .run((err, files) => {
                //console.log(files[0]);
            });
    }

    function jpegMin() {
        images("{jpg,jpeg}", $.jpegtran, {
            progressive: true
        });
    }

    function pngMin() {
        //images("png", $.optipng, {optimizationLevel: 3});
        images("png", $.pngquant, {
            quality: "65-80",
            speed: 4
        });
    }

    function gifMin() {
        images("gif", $.gifsicle, {
            interlaced: true
        });
    }

    function svgMin() {
        images("svg", $.svgo, {
            removeViewBox: false
        });
    }

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:images", function(){
            $.del(config.dest + '/images');
        });
    }

    function create() {
        gulp.task("images", ["clean:images"], function() {
            // @TODO fix sprite function or path
            // sprite();
            // if (process.isProd) sprite(isGzip = true);
            jpegMin();
            pngMin();
            gifMin();
            svgMin();
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
