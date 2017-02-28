/*
 |--------------------------------------------------------------------------
 | Nixin-cli
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */


import gulp from "gulp";
import nix from "nixin-cli";
import rupture from "rupture";
import jeet from "jeet";
import rucksack from "rucksack-css";
import poststylus from "poststylus";


const Test = nix(gulp, {
    source: "./resources",
    destPublicDir: "./public",
    dest: "/_dist",
    tree: "tree",
    app: "app",
    vendor: "vendor",
    mail: "mail",
    plugins: {
        stylus: [
            rupture(),
            jeet(),
            poststylus(rucksack)
        ],
        browserify: []
    },
    bower: {
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


Test.import([
    "default",
    "images",
    "fonts",
    "bower",
    "stylus",
    "sass",
    "less",
    "browserify",
    "serve",
    "build",
    "sprites"
]);


Test.define("build", ["bower"], [
    "images",
    "fonts",
    "bower",
    "stylus",
    "sass",
    "browserify",
    "sprites"
]);
