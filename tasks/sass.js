// ----------------------------------------------------------------------
// Sass
// ----------------------------------------------------------------------


import sass from 'gulp-sass';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import sassGlobbing from 'gulp-sass-glob';
import cached from 'gulp-cached';
import buffer from 'vinyl-buffer';
import mirror from 'gulp-mirror';
import cssnano from 'gulp-cssnano';
import sassLint from 'gulp-sass-lint';
import postcss from 'gulp-postcss';
import gradientfixer from 'postcss-gradientfixer';
import mergeMq from 'gulp-merge-media-queries';
import gzip from 'gulp-gzip';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // merging project plugins with default module plugins
    // and assign to use option
    let plugins = [
        '.',
        './bower_components',
        './node_modules'
    ].concat(config.plugins.sass);

    // extending default config with project config
    Object.assign(config.sass = {
        source: [`/${config.styles}`],
        dest: "",
        inputExt: "{scss,sass}",
        outputExt: "{css,css.map,css.gz}",
        opts: {
            includePaths: plugins,
            indentedSyntax: true,
            precision: 10,
            outputStyle: "expanded",
            style: "expanded",
            importer: []
        },
        cssnano: config.cssnano
    });

    // Public Methods
    // ---------------------------------------------------------

    let clean = () => {
        gulp.task("clean:sass", () => {
            $.del(kernel.setCleanStack("sass", config.app));
        });
    };

    let create = () => {
        gulp.task("sass", ["clean:sass"], (cb) => {
            return gulp.src(kernel.setSourceStack("sass", config.sass.inputExt))
                .pipe(sassLint({
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
                .pipe(sassLint.format())
                .pipe($.plumber())
                .pipe(cached(config.destPublicDir + config.dest, {
                    extension: '.css'
                }))
                .pipe(buffer())
                .pipe($.if(!process.isProd, sourcemaps.init()))
                .pipe(sassGlobbing())
                .pipe(sass(config.sass.opts))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe(kernel.addSuffixPath())
                .pipe(mergeMq({ log: true }))
                .pipe(postcss([ autoprefixer(config.autoprefixer), gradientfixer() ]))
                .pipe($.if(!process.isProd, sourcemaps.write({
                    includeContent: false, // !! outer files sourcemaps broken if true
                    addComment: true
                })))
                .pipe($.if(process.isProd, cssnano(config.sass.cssnano)))
                .pipe($.if(process.isProd, mirror(gzip())))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .pipe($.if(process.isProd, $.browserSync.reload({
                    stream: true
                })));
        });
    };

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        create: create()
    };

};
