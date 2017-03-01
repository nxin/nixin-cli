// ----------------------------------------------------------------------
// Bower
// ----------------------------------------------------------------------


import mainBowerFiles from 'main-bower-files';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import cssnano from 'cssnano';
import uglify from 'gulp-uglify';
import obfuscate from 'gulp-js-obfuscator';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.bower, {
        styles: `${config.source}/${config.vendor}/*/*.css`,
        scripts: `${config.source}/${config.vendor}/*/*.js`,
        cssnano: config.cssnano,
        uglify: config.uglify
    });

    // Private
    // ---------------------------------------------------------

    // get production flag state
    let getEnv = () => {
        return process.isProd ? ' -p' : '';
    };

    // create vendor assets bundle
    let createVendor = (source, files) => {
        let vendor = [];
        for (let i = 0; i < source.length; i++) {
            vendor.push(`${config.source}/${config.vendor}/${source[i]}${files}`);
        }
        return vendor;
    };

    // create vendor fonts/images bundle
    let createSrc = (plugin, files) => {
        return gulp.src(createVendor(plugin, files))
            .pipe($.rename({
                dirname: config.vendor
            }))
            .pipe(gulp.dest(config.destPublicDir + config.dest))
            .on('error', kernel.errors)
            .pipe($.size({
                showFiles: true
            }));
    };

    // Public
    // ---------------------------------------------------------

    // function cleanInstall() {
    //     gulp.task("clean:bower.install", () => {
    //         $.del(`${config.source}/${config.vendor});
    //     });
    // }

    let cleanStyles = () => {
        gulp.task('clean:bower.styles', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}*.{css,css.gz,css.map}`);
        });
    };

    let cleanScripts = () => {
        gulp.task('clean:bower.scripts', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}*.{js,js.gz,js.map}`);
        });
    };

    let cleanImages = () => {
        gulp.task('clean:bower.images', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}/*.{jpeg,jpg,gif,png,svg}`);
        });
    };

    let cleanFonts = () => {
        gulp.task('clean:bower.fonts', () => {
            $.del(`${config.destPublicDir}${config.dest}/${config.vendor}/*.{woff2,woff,ttf,svg,eot}`);
        });
    };

    // let install = () => {
    //     gulp.task('install:bower2', ['clean:bower2.install'], $.shell.task(`bower-installer ${getEnv()}`));
    // };

    let install = () => {
        gulp.task('vendor:desktop', () => {
            return gulp.src($.mainBowerFiles({
                paths: '',
                group: ['desktop', '!mobile'],
                checkExistence: true,
                debugging: true,
                includeDev: false
            }))
                .pipe($.rename({
                    dirname: 'desktop'
                }))
                .pipe(gulp.dest(`${config.source}/${config.vendor}`));
        });


        gulp.task('vendor:mobile', () => {
            return gulp.src($.mainBowerFiles({
                paths: '',
                group: ['!desktop', 'mobile'],
                checkExistence: true,
                debugging: true
            }))
                .on('data', (chunk) => {
                    let contents = chunk.contents.toString().trim();
                    let bufLength = process.stdout.columns;
                    let hr = '\n\n' + Array(bufLength).join('_') + '\n\n';
                    if (contents.length > 1) {
                        process.stdout.write('\n');
                        process.stdout.write(chunk.path);
                        // process.stdout.write(contents);
                        process.stdout.write(hr);
                    }
                })
                .pipe($.rename({
                    dirname: 'mobile'
                }))
                .pipe(gulp.dest(`${config.source}/${config.vendor}`));
        });
    };

    let createStyles = () => {
        gulp.task('create:bower.styles', ['clean:bower.styles'], () => {
            return gulp.src(config.bower.styles)
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
            // .pipe(order(config.bower.order))
            // .pipe($.if(!process.isProd, $.sourcemaps.init()))
                .pipe(concat(`${config.vendor}.css`))
                .pipe(replace(/[^'"()]*(\/[\w-]*(\.(jpeg|jpg|gif|png|woff2|woff|ttf|svg|eot)))/ig, './vendor$1'))
                // .pipe($.if(!process.isProd, $.sourcemaps.write(config.sourcemaps)))
                // .pipe($.if(process.isProd, $.cssnano(config.bower.cssnano)))
                // .pipe($.if(process.isProd, $.mirror(
                //     $.gzip({append: true})
                // )))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .on('error', kernel.errors)
                .pipe($.size({
                    showFiles: true
                }));
        });
    };

    let createScripts = () => {
        gulp.task('create:bower.scripts', ['clean:bower.scripts'], () => {
            return gulp.src(config.bower.scripts)
            // .pipe(order(config.bower.order))
            // .pipe($.if(!process.isProd, sourcemaps.init()))
                .pipe(concat(`${config.vendor}.js`))
                // .pipe($.if(!process.isProd, sourcemaps.write(config.sourcemaps)))
                // .pipe($.if(process.isProd, uglify(config.bower.uglify)))
                // .pipe($.if(process.isProd, mirror(
                //     gzip({append: true})
                // )))
                .pipe(gulp.dest(`${config.destPublicDir}${config.dest}`))
                .on('error', kernel.errors)
                .pipe($.size({
                    showFiles: true
                }));
        });
    };

    let createFonts = () => {
        gulp.task('create:bower.fonts', ['clean:bower.fonts'], () => {
            createSrc(config.bower.assets, '/*.{ttf,eot,svg,woff,woff2}');
        });
    };

    let createImages = () => {
        gulp.task('create:bower.images', ['clean:bower.images'], () => {
            createSrc(config.bower.assets, '/*.{gif,png,jpg,jpeg,cur,svg}');
        });
    };

    let bundle = () => {
        kernel.extendTask('bower2', ['install:bower'], [
            'create:bower.styles',
            'create:bower.scripts',
            'create:bower.fonts',
            'create:bower.images'
        ]);
    };

    // API
    // ---------------------------------------------------------

    return {
        install: install(),
        // cleanInstall: cleanInstall(),
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
