// ----------------------------------------------------------------------
// Mail
// ----------------------------------------------------------------------


import stylus from 'gulp-stylus';
import cached from 'gulp-cached';
import buffer from 'vinyl-buffer';
import inlineCss from 'gulp-inline-css';
import inject from 'gulp-inject';
import injectStyle from 'gulp-style-inject';
import replace from 'gulp-replace';
import autoprefixer from 'autoprefixer';
import cssnano from 'gulp-cssnano';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    Object.assign(config.mail = {
        paths: ["/mail"],
    });


    let inlineStyles = () => {
        gulp.task("inline:mail.styles", () => {
            return gulp.src(`${config.source}${config.mail.paths}/markup/**/*.html`)
                .pipe(inject(
                    gulp.src(`${config.destPublicDir}${config.dest}/mail.css`, {
                        read: false
                    }), {
                        relative: true,
                        starttag: "<!-- inject:mail:{{ext}} -->"
                    }
                ))
                .pipe(inlineCss({
                    applyStyleTags: true,
                    applyLinkTags: true,
                    removeStyleTags: true,
                    removeLinkTags: true
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(`${config.destPublicDir}${config.dest}${config.mail.paths}/markup`));
        });
    };

    let convertStyles = () => {
        gulp.task("convert:mail.styles", () => {
            return gulp.src(`${config.source}${config.mail.paths}/markup/**/*.html`)
                .pipe(replace(/<link.*?href="(.+?\.css)"[^>]*>/g, function(s, filename) {
                    let style = $.fs.readFileSync(filename, "utf8");
                    return "<style>\n" + style + "\n</style>";
                }))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(`${config.destPublicDir}${config.dest}${config.mail.paths}/markup`));
        });
    };

    // Public
    // ---------------------------------------------------------

    let clean = () => {
        gulp.task("clean:mail", () => {
            $.del([
                `${config.dist}/mail/markup`,
                `${config.dist}/mail/styles`
            ], {
                force: true
            });
        });
    };

    let createStyles = () => {
        gulp.task("create:mail.styles", () => {
            return gulp.src(`${config.source}${config.mail.paths}/styles/*.styl`)
                .pipe(cached(config.destPublicDir + config.dest, {
                    extension: ".css"
                }))
                .pipe(buffer())
                .pipe(sourcemaps.init())
                .pipe(stylus(config.stylus.opts))
                .on('error', kernel.errors)
                .pipe(postcss([ autoprefixer(config.autoprefixer) ]))
                .pipe($.rename({
                    basename: config.mail
                }))
                .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                .pipe($.if(process.isProd, cssnano()))
                .pipe($.size({
                    showFiles: true
                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest + config.mail.paths))
                .pipe($.if(process.isProd, $.browserSync.reload({
                    stream: true
                })));
        });
    };

    let bundle = () => {
        kernel.extendTask("mail", ["clean:mail"], [
            'create:mail.styles',
            ['inline:mail.styles'],
            ['inject:mail.styles'],
            ['convert:mail.styles']
        ]);
    };

    // API
    // ---------------------------------------------------------

    return {
        clean: clean(),
        inlineStyles: inlineStyles(),
        convertStyles: convertStyles(),
        createStyles: createStyles(),
        bundle: bundle()
    };
};
