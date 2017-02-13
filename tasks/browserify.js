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
        // babelify: require("babelify"),
        // deamdify: require("deamdify"),
        obfuscate: require("gulp-js-obfuscator"),
        // es2015: require("babel-preset-es2015"),
        jshint: require("gulp-jshint"),
        jshintStylish: require("jshint-stylish")
    });

    // Config
    // ---------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    let plugins = [
        $.globify,
        // $.deamdify,
        // $.babelify.configure({
        //     presets: [$.es2015]
        // })
    ].concat(config.plugins.browserify);

    // extending default config with project config
    Object.assign(config.browserify = {
        source: ["/" + config.scripts],
        dest: "",
        inputExt: "js",
        outputExt: "{js,js.map,js.gz}",
        transform: plugins,
        debug: !process.isProd,
        uglify: config.uglify
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:browserify", () => {
            $.del(kernel.setCleanStack("browserify", config.app))
        });
    }

    function create() {
        gulp.task('browserify', ["clean:browserify"], (cb) => {
            let browserified = () => {
                return $.through.obj(function (chunk, enc, callback) {
                    if (chunk.isBuffer()) {
                        let b = $.browserify({
                            entries: chunk.path,
                            transform: config.browserify.transform,
                            debug: config.browserify.debug
                        });
                        // Any custom browserify stuff should go here
                        // .transform($.babelify.configure({
                        //     presets: [$.es2015]
                        // }));

                        chunk.contents = b.bundle();
                        this.push(chunk);

                    }
                    callback();
                });
            };

            return gulp.src(kernel.setSourceStack("browserify", config.browserify.inputExt))
                .pipe($.jshint())
                .pipe($.jshint.reporter($.jshintStylish))
                .pipe($.plumber())
                .pipe(browserified())
                .pipe($.cached(config.destPublicDir + config.dest, {
                    extension: '.js'
                }))
                .pipe($.buffer())
                .pipe($.if(!process.isProd, $.sourcemaps.init({loadMaps: true})))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.uglify(config.browserify.uglify)))
                .pipe($.if(process.isProd, $.mirror($.gzip())))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
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
