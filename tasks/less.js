// ----------------------------------------------------------------------
// Sass
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, kernel, $) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    Object.assign($, {
        less: require("gulp-less"),
        autoprefixer: require("gulp-autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cssGlobbing: require('gulp-css-globbing'),
        cached: require("gulp-cached"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.less = {
        source: ["/" + config.styles],
        dest: "",
        inputExt: "less",
        outputExt: "{css,css.map,css.gz}",
        opts: {},
        cssnano: config.cssnano
    });

    // Public Methods
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:less", () => {
            $.del(kernel.setCleanStack("less", config.app))
        });
    }

    function create() {
        gulp.task("less", ["clean:less"], () => {
            return gulp.src(kernel.setSourceStack("less", config.stylus.inputExt))
                .pipe($.cached(config.destPublicDir + config.dest, {
                    extension: '.css'
                }))
                .pipe($.buffer())
                .pipe($.if(!process.isProd, $.sourcemaps.init({loadMaps: true})))
                .pipe($.cssGlobbing({
                    extensions: ['.less']
                }))
                .pipe($.less())
                .pipe($.autoprefixer(config.autoprefixer))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe(kernel.addSuffixPath())
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.cssnano()))
                .pipe($.if(process.isProd, $.mirror($.gzip())))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .pipe($.if(process.isProd, $.browserSync.reload({
                    stream: true
                })));
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
