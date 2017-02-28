// ----------------------------------------------------------------------
// Bower
// ----------------------------------------------------------------------


import order from 'gulp-order';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import cssnano from 'cssnano';
import uglify from 'gulp-uglify';
import obfuscate from 'gulp-js-obfuscator';
import sourcemaps from 'gulp-sourcemaps';
import mirror from 'gulp-mirror';
import gzip from 'gulp-gzip';



module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.bower, {
        styles: `${config.source}/${config.vendor}/**/*.css`,
        scripts: `${config.source}/${config.vendor}/**/*.js`,
        cssnano: config.cssnano,
        uglify: config.uglify
    });

    // Private
    // ---------------------------------------------------------

    // get production flag state
    function getEnv() {
        return process.isProd ? ' -p' : '';
    }

    // create vendor assets bundle
    function createVendor(source, files) {
        let vendor = [];
        for (let i = 0; i < source.length; i++) {
            vendor.push(`${config.source}/${config.vendor}/${source[i]}${files}`);
        }
        return vendor;
    }

    // create vendor fonts/images bundle
    function createSrc(plugin, files) {
        return gulp.src(createVendor(plugin, files))
            .pipe($.rename({
                dirname: config.vendor
            }))
            .pipe($.size({
                showFiles: true
            }))
            .pipe(gulp.dest(`${config.destPublicDir}${config.dest}`))
            .on('error', kernel.errors);
    }

    // Public
    // ---------------------------------------------------------

    function cleanInstall() {
        gulp.task('clean:bower.install', () => {
            $.del(`${config.source}/${config.vendor}`);
        });
    }

    function cleanStyles() {
        gulp.task('clean:bower.styles', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}*.{css,css.gz,css.map}`);
        });
    }

    function cleanScripts() {
        gulp.task('clean:bower.scripts', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}*.{js,js.gz,js.map}`);
        });
    }

    function cleanImages() {
        gulp.task('clean:bower.images', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}/*.{jpeg,jpg,gif,png,svg}`);
        });
    }

    function cleanFonts() {
        gulp.task('clean:bower.fonts', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}/*.{woff2,woff,ttf,svg,eot}`);
        });
    }

    function install() {
        gulp.task('install:bower', ['clean:bower.install'], $.shell.task(`bower-installer ${getEnv()}`));
    }

    function createStyles() {
        gulp.task('create:bower.styles', ['clean:bower.styles'], () => {
            return gulp.src(config.bower.styles)
                .pipe(order(config.bower.order))
                .pipe($.if(!process.isProd, sourcemaps.init()))
                .pipe(concat(config.vendor + '.css'))
                // .pipe(replace(/[^'"()]*(\/[\w-]*(\.(jpeg|jpg|gif|png|woff2|woff|ttf|svg|eot)))/ig, './vendor$1'))
                .pipe(kernel.addSuffixPath('vendor'))
                .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, cssnano(config.bower.cssnano)))
                .pipe($.if(process.isProd, mirror(
                    gzip({append: true})
                )))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(`${config.destPublicDir}${config.dest}`))
                .on('error', kernel.errors);
        });
    }

    function createScripts() {
        gulp.task('create:bower.scripts', ['clean:bower.scripts'], function () {
            return gulp.src(config.bower.scripts)
                .pipe(order(config.bower.order))
                .pipe($.if(!process.isProd, sourcemaps.init()))
                .pipe(concat(config.vendor + '.js'))
                .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, uglify(config.bower.uglify)))
                .pipe($.if(process.isProd, mirror(
                    gzip({append: true})
                )))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(`${config.destPublicDir}${config.dest}`))
                .on('error', kernel.errors);
        });
    }

    function createFonts() {
        gulp.task('create:bower.fonts', ['clean:bower.fonts'], () => {
            createSrc('*', '/*.{ttf,eot,svg,woff,woff2}');
        });
    }

    function createImages() {
        gulp.task('create:bower.images', ['clean:bower.images'], () => {
            createSrc('*', '/*.{gif,png,jpg,jpeg,cur,svg}');
        });
    }

    function bundle() {
        kernel.extendTask('bower', ['install:bower'], [
            'create:bower.styles',
            'create:bower.scripts',
            'create:bower.fonts',
            'create:bower.images'
        ]);
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
