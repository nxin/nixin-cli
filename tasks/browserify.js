// ----------------------------------------------------------------------
// Browserify
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        browserify: require("browserify"),
        cached: require("gulp-cached"),
        mirror: require("gulp-mirror"),
        sourcemaps: require("gulp-sourcemaps"),
        uglify: require("gulp-uglify"),
        gzip: require("gulp-gzip"),
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
    Object.assign(config.browserify = {
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
        gulp.task("clean:browserify", () => {
            $.del(kernel.setCleanStack("browserify", config.app))
        });
    }

    function create() {
        gulp.task('browserify', ["clean:browserify"], function (cb) {
            var browserified = () => {
                return $.through.obj(function (chunk, enc, callback) {
                    if (chunk.isBuffer()) {
                        var b = $.browserify({
                            entries: chunk.path,
                            transform: config.browserify.transform,
                            debug: config.browserify.debug
                        }, (res) => {
                            $.gutil.log("in result");
                            console.log(res);
                            res.on("end", () => {
                                console.log('res.end');
                                cb();
                            });
                            res.on("data", () => {
                                console.log("res.data");
                            });
                        }).on("error", (e) => {
                            $.gutil.log("in error");
                            cb(e);
                        });
                        // Any custom browserify stuff should go here
                        //.transform(to5browserify);

                        chunk.contents = b.bundle();
                        this.push(chunk);

                    }
                    callback();
                });
            };

            return gulp.src(kernel.setSourceStack("browserify", config.browserify.inputExt))
                .pipe(browserified())
                .pipe($.cached(config.dest, {
                    extension: '.js'
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    // $.uglify(config.browserify.uglify).pipe($.obfuscate()),
                    // $.uglify(config.browserify.uglify).pipe($.obfuscate()).pipe($.gzip())
                    $.uglify(config.browserify.uglify),
                    $.uglify(config.browserify.uglify).pipe($.gzip())
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
