// ----------------------------------------------------------------------
// Stylus
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, utils, $, _) {

    process.env.mode = "stylus";

    // --- Dependencies -------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        stylus: require("gulp-stylus"),
        autoprefixer: require("gulp-autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cached: require("gulp-cached"),
        gzip: require("gulp-gzip"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano"),
        groupMq: require("gulp-group-css-media-queries"),
        postcss: require("postcss"),
        replace: require("gulp-replace")
    });

    // --- Config -------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    var plugins = [].concat(config.npm.stylus);

    // extending default config with project config
    _.extend(config.stylus = {
        paths: ["/styles/*.styl"],
        opts: {
            import: [],
            use: plugins,
            "include css": true,
            compress: process.isProd,
            comment: !process.isProd
        },
        outputExt: "{css,css.map,css.gz}",
        suffixPath: "--no-suffix"
    });

    // --- Public -------------------------------------------------------

    function clean() {
        gulp.task("clean:stylus", function () {
            $.del(utils.setCleanStack("stylus", config.app))
        });
    }

    function create() {
        gulp.task("stylus", ["clean:stylus"], function (cb) {

            function makeChange(){

                function patterns(suffixPath){
                    return [
                        {
                            pattern: /[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig,
                            replacement: './images/$2' + suffixPath + '$3'
                        },
                        {
                            pattern: /[^'"()]*(\/([\w-]*)(\.(woff2|woff|ttf|svg|eot)))/ig,
                            replacement: './images/$2' + suffixPath + '$3'
                        }
                    ];
                }

                function transform(file, cb) {

                    // read and modify file contents
                    file.contents = new Buffer(String(file.contents) + ' some modified content');

                    var suffix = file.path.split(config.app)[1].split(".css")[0];
                    var fileContentTrimmed = file.contents.toString().trim();

                    // console.log(file.contents.toString());
                    // console.log(suffix);

                    console.log($.frep.strWithArr(fileContentTrimmed, patterns(suffix)));

                    fileContentTrimmed = $.frep.strWithArr(fileContentTrimmed, patterns(suffix));

                    file.contents = new Buffer(fileContentTrimmed.toString('hex'));

                    // if there was some error, just pass as the first parameter here
                    cb(null, file);
                }

                return require('event-stream').map(transform);
            }


            gulp.src(utils.setSourceStack("stylus"))
                .pipe($.cached(config.dest, {
                    extension: ".css"
                }))
                .pipe($.buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.stylus(config.stylus.opts), function (res) {
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
                .pipe($.autoprefixer(config.autoprefixer))
                .pipe($.rename(function (filepath) {
                    utils.rewritePath(filepath, config.app);
                }))
                .pipe(makeChange())
                // .on('data', function (chunk) {
                //
                //     console.log(patterns);
                //
                //     var contents = chunk.contents.toString().trim();
                //     var bufLength = process.stdout.columns;
                //     var hr = '\n\n' + Array(bufLength).join("_") + '\n\n';
                //     if (contents.length > 1) {
                //         process.stdout.write('\n');
                //         process.stdout.write(chunk.path);
                //         process.stdout.write(contents);
                //         process.stdout.write(hr);
                //     }
                // })
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.cssnano(),
                    $.cssnano().pipe($.gzip())
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

    function postCSS() {
        gulp.task("postCSS", function (cb) {
            return gulp.src(config.dest + "/app*.css")
                .pipe($.replace(/[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig, './images/$2' + process.env.NODE_ENV + '$3'))
                .pipe($.groupMq())
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }



    // --- API ----------------------------------------------------------

    return {
        clean: clean(),
        create: create(),
        postCSS: postCSS()
    };

};
