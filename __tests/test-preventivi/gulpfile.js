/*
 |--------------------------------------------------------------------------
 | Nixin-cli
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */


/*jshint esversion: 6 */


var gulp = require("gulp"),
    rupture = require("rupture"),
    jeet = require("jeet"),
    rucksack = require("rucksack-css"),
    poststylus = require("poststylus");


var nix = require("nixin-cli")(gulp, {
    source: __dirname + "/resources",
    dest: __dirname + "/public/_dist",
    app: "app",
    vendor: "vendor",
    mail: "mail",
    npm: {
        stylus: [
            rupture(),
            jeet(),
            poststylus(rucksack)
        ],
        browserify: []
    },
    bower: {
        plugins: [
            "bootstrap"
        ],
        order: [
            "jquery/*",
            "bootstrap/*",
            "**/*.js"
        ]
    },
    serve: {
        host: "localhost",
        proxy: "localhost/",
        port: "9001"
    }
});


nix.run([
    "default",
    "images",
    "fonts",
    "bower",
    "stylus",
    "sass",
    "less",
    "browserify"
]);


gulp.task("build", ["bower"], function () {
    $.runSequence(["browserify", "stylus", "fonts", "images"]);
});


gulp.task("build:serve", ["build", "serve:watch"]);
