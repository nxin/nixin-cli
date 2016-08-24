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
    tree: "flatten", // flatten || tree
    app: "app",
    vendor: "vendor",
    sourcemaps: {
        includeContent: true,
        addComment: true
    },
    autoprefixer: {
        browsers: ['last 3 versions'],
        cascade: false
    },
    stylus: {},
    sass: {},
    less: {},
    browserify: {},
    pug: {},
    bower: {
        plugins: [],
        order: []
    },
    serve: {
        host: "local.dev",
        proxy: "local.dev/",
        port: "8001"
    }
};

module.exports = config;
