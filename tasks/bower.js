// ----------------------------------------------------------------------
// Bower
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, utils, $, _) => {

    // Dependencies
    // ---------------------------------------------------------

    // extending module dependencies with project dependencies
    // using $ as alias
    _.extend($, {
        order: require("gulp-order"),
        replace: require("gulp-replace"),
        concat: require("gulp-concat"),
        cssnano: require("gulp-cssnano"),
        uglify: require("gulp-uglify"),
        obfuscate: require("gulp-js-obfuscator")
    });

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    _.extend(config.bower, {
        styles: config.source + "/" + config.vendor + "/**/*.css",
        scripts: config.source + "/" + config.vendor + "/**/*.js",
        uglify: {
            wrap: 'spesafacile',
            mangle: true,
            outSourceMap: false,
            sourceMapIncludeSources: true
        }
    });

    // Private
    // ---------------------------------------------------------

    // get production flag state
    function getEnv() {

        var productionFlag = '';

        if (process.isProd === true) {
            productionFlag = ' -p';
        }

        return productionFlag;
    }

    // create vendor assets bundle
    function createVendor(source, files) {
        var vendor = [];
        for (var i = 0; i < source.length; i++) {
            vendor.push(config.source + "/" + config.vendor + "/" + source[i] + files);
        }
        return vendor;
    }

    // create vendor fonts/images bundle
    function createSrc(plugin, files){
        return gulp.src(createVendor(plugin, files))
            .pipe($.rename({
                dirname: config.vendor
            }))
            .pipe(gulp.dest(config.dest))
            .on('error', utils.errors)
            .pipe($.size({
                showFiles: true
            }));
    }

    // Public
    // ---------------------------------------------------------

    function cleanInstall(){
        gulp.task("clean:bower.install", () => {
            $.del(config.source + "/" + config.vendor);
        });
    }

    function cleanStyles() {
        gulp.task("clean:bower.styles", () => {
            $.del(config.dest + "/" + config.vendor + "*.{css,css.gz,css.map}");
        });
    }

    function cleanScripts() {
        gulp.task("clean:bower.scripts", () => {
            $.del(config.dest + "/" + config.vendor + "*.{js,js.gz,js.map}");
        });
    }

    function cleanImages() {
        gulp.task("clean:bower.images", () => {
            $.del(config.dest + "/" + config.vendor + "/*.{jpeg,jpg,gif,png,svg}");
        });
    }

    function cleanFonts() {
        gulp.task("clean:bower.fonts", () => {
            $.del(config.dest + "/" + config.vendor + "/*.{woff2,woff,ttf,svg,eot}");
        });
    }

    function install() {
        gulp.task("install:bower", ["clean:bower.install"], $.shell.task("bower-installer" + getEnv()));
    }

    function createStyles() {
        gulp.task("create:bower.styles", ["clean:bower.styles"], () => {
            return gulp.src(config.bower.styles)
                .pipe($.order(config.bower.order))
                .pipe($.sourcemaps.init())
                .pipe($.concat(config.vendor + ".css"))
                .pipe($.replace(/[^'"()]*(\/[\w-]*(\.(jpeg|jpg|gif|png|woff2|woff|ttf|svg|eot)))/ig, './vendor$1'))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.cssnano(),
                    $.cssnano().pipe($.gzip())
                )))
                .pipe(gulp.dest(config.dest))
                .on('error', utils.errors)
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function createScripts() {
        gulp.task("create:bower.scripts", ["clean:bower.scripts"], () => {
            return gulp.src(config.bower.scripts)
                .pipe($.order(config.bower.order))
                .pipe($.sourcemaps.init())
                .pipe($.concat(config.vendor + ".js"))
                .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, $.mirror(
                    $.uglify(config.bower.uglify).pipe($.obfuscate()),
                    $.uglify(config.bower.uglify).pipe($.obfuscate()).pipe($.gzip())
                )))
                .pipe(gulp.dest(config.dest))
                .on('error', utils.errors)
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    function createFonts() {
        gulp.task("create:bower.fonts", ["clean:bower.fonts"], () => {
            createSrc(config.bower.assets, '/*.{ttf,eot,svg,woff,woff2}');
        });
    }

    function createImages() {
        gulp.task("create:bower.images", ["clean:bower.images"], () => {
            createSrc(config.bower.assets, '/*.{gif,png,jpg,jpeg,cur,svg}');
        });
    }

    function bundle() {
        gulp.task("bower", ["install:bower"], () => {
            $.runSequence([
                "create:bower.styles",
                "create:bower.scripts",
                "create:bower.fonts",
                "create:bower.images"
            ]);
        });
    }

    // API
    // ---------------------------------------------------------

    return {
        install: install(),
        cleanInstall: cleanInstall(),
        cleanStyles: cleanStyles(),
        cleanScripts: cleanScripts(),
        cleanFonts: cleanFonts(),
        cleanImages: cleanImages(),
        createStyles: createStyles(),
        createScripts: createScripts(),
        createFonts: createFonts(),
        createImages: createImages(),
        bundle: bundle()
    };

};
