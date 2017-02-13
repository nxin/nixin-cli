// ----------------------------------------------------------------------
// Stylus
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // --- Dependencies -------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        stylus: require("gulp-stylus"),
        autoprefixer: require("autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cached: require("gulp-cached"),
        gzip: require("gulp-gzip"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano"),
        groupMq: require("gulp-group-css-media-queries"),
        postcss: require("gulp-postcss"),
        stylint: require("gulp-stylint"),
        stylintStylish: require("stylint-stylish")
    });

    // --- Config -------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    let plugins = [].concat(config.plugins.stylus);

    // extending default config with project config
    Object.assign(config.stylus = {
        source: ["/" + config.styles],
        dest: "",
        inputExt: "styl",
        outputExt: "{css,css.map,css.gz}",
        opts: {
            import: [],
            use: plugins,
            "include css": true,
            compress: process.isProd,
            comment: !process.isProd
        },
        cssnano: config.cssnano
    });

    // --- Public -------------------------------------------------------

    function clean() {
        gulp.task("clean:stylus", () => {
            $.del(kernel.setCleanStack("stylus", config.app))
        });
    }

    function create() {
        gulp.task("stylus", ["clean:stylus"], (cb) => {
            return gulp.src(kernel.setSourceStack("stylus", config.stylus.inputExt))
                .pipe($.stylint({
                    config: ".stylintrc",
                    reporter: "stylint-stylish",
                    reporterOptions: {
                        absolutePath: true,
                        verbose: true
                    }
                }))
                .pipe($.stylint.reporter())
                .pipe($.plumber())
                .pipe($.cached(config.destPublicDir + config.dest, {
                    extension: ".css"
                }))
                .pipe($.buffer())
                .pipe($.if(!process.isProd, $.sourcemaps.init({loadMaps: true})))
                .pipe($.stylus(config.stylus.opts))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe(kernel.addSuffixPath())
                // .on('data', function (chunk) {
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
                .pipe($.postcss([ $.autoprefixer(config.autoprefixer) ]))
                // .pipe($.groupMq()) //bug cannot read property '2' of null
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.cssnano()))
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

    // --- API ----------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
