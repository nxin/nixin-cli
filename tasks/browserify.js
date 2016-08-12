// ----------------------------------------------------------------------
// Browserify
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, utils, $, _) {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        browserify: require("gulp-browserify"),
        globby: require("globby"),
        cached: require("gulp-cached"),
        mirror: require("gulp-mirror"),
        source: require("vinyl-source-stream"),
        sourcemaps: require("gulp-sourcemaps"),
        uglify: require("gulp-uglify"),
        gzip: require("gulp-gzip"),
        through: require("through2"),
        buffer: require("vinyl-buffer"),
        globify: require("require-globify"),
        obfuscate: require("gulp-js-obfuscator")
    });

    // Config
    // ---------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    var plugins = [
        $.globify
    ].concat(config.npm.browserify);

    // extending default config with project config
    _.extend(config.browserify = {
        source: ["/scripts"],
        dest: "",
        inputExt: "js",
        outputExt: "{js,js.map,js.gz}",
        transform: [$.globify],
        debug: !process.isProd,
        uglify: {
            wrap: 'app',
            mangle: true,
            outSourceMap: false,
            sourceMapIncludeSources: true
        }
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:browserify", function () {
            $.del(utils.setCleanStack("browserify", config.app))
        });
    }

    function create() {
        gulp.task("browserify", ["clean:browserify"], function (cb) {
            gulp.src(utils.setSourceStack("browserify", config.browserify.inputExt))
                .pipe($.browserify(config.browserify.opts), function (res) {
                    $.gutil.log("in result");
                    console.log(res);
                    res.on("end", function () {
                        console.log('res.end');
                        cb();
                    });
                    res.on("data", function () {
                        console.log("res.data");
                    });
                }).on("error", function (e) {
                $.gutil.log("in error");
                cb(e);
            })
                .pipe($.cached(config.dest, {
                    extension: '.js'
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath, config.app);
                }))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.uglify(config.browserify.uglify).pipe($.obfuscate()),
                    $.uglify(config.browserify.uglify).pipe($.obfuscate()).pipe($.gzip())
                )))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe($.browserSync.reload({
                    stream: true
                }));
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };
};
