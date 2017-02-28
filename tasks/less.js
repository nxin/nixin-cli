// ----------------------------------------------------------------------
// Sass
// ----------------------------------------------------------------------

import less from 'gulp-less';
import autoprefixer from 'autoprefixer';
import gradientfixer from 'postcss-gradientfixer';
import sourcemaps from 'gulp-sourcemaps';
import cssGlobbing from 'gulp-css-globbing';
import cached from 'gulp-cached';
import buffer from 'vinyl-buffer';
import mirror from 'gulp-mirror';
import cssnano from 'gulp-cssnano';
import mergeMq from 'gulp-merge-media-queries';
import postcss from 'postcss';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.less = {
        source: [`/${config.styles}`],
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
            $.del(kernel.setCleanStack("less", config.app));
        });
    }

    function create() {
        gulp.task("less", ["clean:less"], () => {
            return gulp.src(kernel.setSourceStack("less", config.stylus.inputExt))
                .pipe(cached(config.destPublicDir + config.dest, {
                    extension: '.css'
                }))
                .pipe(buffer())
                .pipe($.if(!process.isProd, sourcemaps.init({loadMaps: true})))
                .pipe(cssGlobbing({
                    extensions: ['.less']
                }))
                .pipe(less())
                .pipe(autoprefixer(config.autoprefixer))
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath, config.app);
                }))
                .pipe(kernel.addSuffixPath())
                .pipe(mergeMq({ log: true }))
                .pipe(postcss([ autoprefixer(config.autoprefixer), gradientfixer() ]))
                .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, cssnano()))
                .pipe($.if(process.isProd, mirror(gzip())))
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
