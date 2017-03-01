// ----------------------------------------------------------------------
// Browserify
// ----------------------------------------------------------------------


import browserify from 'browserify';
import cached from 'gulp-cached';
import mirror from 'gulp-mirror';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import gzip from 'gulp-gzip';
import buffer from 'vinyl-buffer';
import globify from 'require-globify';
import obfuscate from 'gulp-js-obfuscator';
import jshint from 'gulp-jshint';
import jshintStylish from 'jshint-stylish';
import babelify from 'babelify';
import deamdify from 'deamdify';
import es2015 from 'babel-preset-es2015';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    let plugins = [ globify, deamdify, babelify.configure({
            presets: [es2015]
        })
    ].concat(config.plugins.browserify);

    // extending default config with project config
    Object.assign(config.browserify = {
        source: [`/${config.scripts}`],
        dest: '',
        inputExt: 'js',
        outputExt: '{js,js.map,js.gz}',
        transform: plugins,
        debug: !process.isProd,
        uglify: config.uglify
    });

    // Private
    // ---------------------------------------------------------

    let browserified = () => {
        return $.through.obj(function (chunk, enc, callback) {
            if (chunk.isBuffer()) {
                let b = browserify({
                    entries: chunk.path,
                    transform: config.browserify.transform,
                    debug: config.browserify.debug
                })
                // Any custom browserify stuff should go here
                .transform(babelify.configure({
                    presets: [es2015]
                }));

                chunk.contents = b.bundle();
                this.push(chunk);

            }
            callback();
        });
    };

    // Public
    // ---------------------------------------------------------

    let clean = () => {
        gulp.task('clean:browserify', () => {
            $.del(kernel.setCleanStack('browserify', config.app));
        });
    };

    let create = () => {
        gulp.task('browserify', ['clean:browserify'], (cb) => {
            return gulp.src(kernel.setSourceStack('browserify', config.browserify.inputExt))
                .pipe(jshint())
                .pipe(jshint.reporter(jshintStylish))
                .pipe($.plumber())
                .pipe(browserified())
                .pipe(cached(config.destPublicDir + config.dest, {
                    extension: '.js'
                }))
                .pipe(buffer())
                .pipe($.if(!process.isProd, sourcemaps.init({loadMaps: true})))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, uglify(config.browserify.uglify)))
                .pipe($.if(process.isProd, mirror(gzip())))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .pipe($.browserSync.reload({
                    stream: true
                }));
        });
    };


    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };
};
