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
            "html5shiv",
            "modernizr/*",
            "jquery/*",
            "angular/*",
            "angular-bootstrap/*",
            "bootstrap/*",
            "**/*.js"
        ]
    }
});


nix.run([
    "default",
    "images",
    "fonts",
    "stylus",
    "browserify",
    "bower"
]);


gulp.task("build", ["bower"] ,function () {
    $.runSequence(["stylus", "fonts", "images"]);
});
