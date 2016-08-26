/*
 |--------------------------------------------------------------------------
 | Nixin-cli
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */


/*jshint esversion: 6 */
"use strict";

import gulp from "gulp";
import rupture from "rupture";
import jeet from "jeet";
import rucksack from "rucksack-css";
import poststylus from "poststylus";


const nix = require("nixin-cli")(gulp, {
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
        assets: [
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
    "browserify",
    "serve",
    "build"
]);


nix.extend("build", ["bower"], [
    "images",
    "fonts",
    "bower",
    "stylus",
    "sass",
    "less",
    "browserify"
], (() => {
    console.log("======> extended task!")
})());


