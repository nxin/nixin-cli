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
        sass: require("gulp-sass"),
        autoprefixer: require("gulp-autoprefixer"),
        sourcemaps: require("gulp-sourcemaps"),
        cssGlobbing: require('gulp-css-globbing'),
        cached: require("gulp-cached"),
        buffer: require("vinyl-buffer"),
        mirror: require("gulp-mirror"),
        cssnano: require("gulp-cssnano"),
        sassLint: require("gulp-sass-lint")
    });

    // Config
    // ---------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    var plugins = [].concat(config.plugins.sass);

    // extending default config with project config
    Object.assign(config.sass = {
        source: ["/styles"],
        dest: "",
        inputExt: "{sass,scss}",
        outputExt: "{css,css.map,css.gz}",
        opts: {
            includePaths: plugins,
            indentedSyntax: true,
            precision: 10,
            outputStyle: "expanded",
            importer: []
        },
        cssnano: config.cssnano
    });

    // Public Methods
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sass", () => {
            $.del(kernel.setCleanStack("sass", config.app));
        });
    }

    function create() {
        gulp.task("sass", ["clean:sass"], (cb) => {
            return gulp.src(kernel.setSourceStack("sass", config.sass.inputExt))
                .pipe($.cached(config.dest, {
                    extension: '.css'
                }))
                .pipe($.buffer())
                .pipe($.if(!process.isProd, $.sourcemaps.init({loadMaps: true})))
                .pipe($.cssGlobbing({
                    extensions: ['.scss', '.sass']
                }))
                .pipe($.sassLint({
                    options: {
                        'formatter': 'stylish',
                        'merge-default-rules': false
                    },
                    files: {ignore: '**/*.scss'},
                    rules: {
                        'no-ids': 1,
                        'no-mergeable-selectors': 0
                    },
                    config: '.sass-lint.yml'
                }))
                .pipe($.sassLint.format())
                .pipe($.plumber())
                .pipe($.sass(config.sass.opts))
                .pipe($.autoprefixer(config.autoprefixer))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe(kernel.addSuffixPath())
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.cssnano(config.sass.cssnano)))
                .pipe($.if(process.isProd, $.mirror($.gzip())))
                .pipe(gulp.dest(config.dest))
                .pipe($.size({
                    showFiles: true
                }))
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
