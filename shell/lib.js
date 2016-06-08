// ----------------------------------------------------------------------
// Lib
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

var gulp = require("gulp");
$ = {
    vinylPaths: require("vinyl-paths"),
    del: require("del"),
    browserSync: require('browser-sync').create(),
    size: require("gulp-size"),
    rename: require("gulp-rename"),
    taskListing: require("gulp-task-listing"),
    if: require("gulp-if"),
    argv: require("yargs").argv,
    runSequence: require("run-sequence").use(gulp),
    shell: require("gulp-shell"),
    gutil: require("gulp-util"),
    stripDebug: require("gulp-strip-debug"),
    colors: require("chalk"),
    hashmark: require('hashmark')
};

module.exports = $;
