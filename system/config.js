// ----------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

var $ = require("./lib");

// --- Config ------------------------------------------------------------

// set production flag
// --prod || -p \\ --env=prod
process.isProd = $.argv.prod || $.argv.p || $.gutil.env.env === "prod" || false;

// Default config
// @config {paths}
const config = {
    source: "./source",
    dest: "./dist",
    styles: "styles",
    scripts: "scripts",
    images: "images",
    fonts: "fonts",
    sprites: "sprites",
    tree: "flatten", // flatten || tree
    app: "app",
    vendor: "vendor",
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
        browsers: ['last 3 versions'],
        cascade: false
    },
    bower: {
        plugins: [],
        order: []
    },
    serve: {
        host: "local.dev",
        proxy: "local.dev/",
        port: "9001"
    }
};

module.exports = config;
