// ----------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------


// Default config
// @config {paths}
module.exports = (settings, $) => {

    // set production flag
    // --prod || -p \\ --env=prod
    process.isProd = $.argv.prod || $.argv.p || $.gutil.env.env === 'prod' || false;

    let config = {
        source: './source',
        destPublicDir: './public',
        dest: '/dist',
        styles: 'styles',
        scripts: 'scripts',
        images: 'images',
        fonts: 'fonts',
        sprites: 'sprites',
        tree: 'flatten', // flatten || tree
        app: 'app',
        vendor: 'vendor',
        sourcemaps: {
            includeContent: true,
            addComment: true
        },
        uglify: {
            mangle: true,
            preserveComments: false,
            options: {
                source_map: false,
                comments: false
            }
        },
        cssnano: {
            discardComments: {
                removeAll: true
            }
        },
        imagemin: {
            jpegtran: {
                progressive: true
            },
            pngquant: {
                speed: 4
            },
            gifsicle: {
                interlaced: true
            },
            svgo: {
                removeViewBox: false
            }
        },
        autoprefixer: {
            browsers: ['> 0%'],
            cascade: false,
            add: true
        },
        bower: {
            plugins: [],
            order: []
        },
        serve: {
            host: 'localhost',
            proxy: 'localhost',
            port: '9001'
        }
    };

    return Object.assign(config, settings);
};
