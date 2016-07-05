// ----------------------------------------------------------------------
// Browserify
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function(gulp, config, routes, utils, $, _) {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        browserify: require("browserify"),
        globby: require("globby"),
        cached: require("gulp-cached"),
        mirror: require("gulp-mirror"),
        source: require("vinyl-source-stream"),
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
        entries: [config.source + "/scripts/*.js"],
        transform: [$.globify],
        debug: !process.isProd
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:browserify", function() {
            $.del(config.dest + "/" + config.app + ".{js,js.map,js.gz}");
        });
    }

    function create() {
        gulp.task("browserify", ["clean:browserify"], function(cb) {
            var bundledStream = $.through();

            bundledStream.pipe($.source(config.app + ".js"), function(res) {
                    $.gutil.log('in result');
                    console.log(res);
                    res.on('end', function() {
                        console.log('res.end');
                        cb();
                    });
                    res.on('data', function() {
                        console.log('res.data');
                    });
                }).on('error', function(e) {
                    $.gutil.log('in error');
                    cb(e);
                })
                .pipe($.cached(config.dest, {
                    extension: '.js'
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init())
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.uglify({
                        mangle: true
                    }).pipe($.obfuscate()),
                    $.uglify({
                        mangle: true
                    }).pipe($.obfuscate()).pipe($.gzip())
                )))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe($.browserSync.reload({
                    stream: true
                }));

            $.globby(config.browserify.entries).then(function(entries) {
                var b = $.browserify({
                    entries: entries,
                    transform: config.browserify.transform,
                    debug: config.browserify.debug
                });

                b.bundle().pipe(bundledStream);
            }).
            catch(function(err) {
                bundledStream.emit('error', err);
            });

            return bundledStream;
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };
};
