// ----------------------------------------------------------------------
// Lib
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

var gulp = require("gulp");
$ = {
    fs: require("fs"),
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
    hashmark: require("hashmark"),
    path: require("path"),
    merge: require("merge-stream"),
    flatten: require("gulp-flatten"),
    stream: require("stream"),
    through2: require("through2"),
    frep: require("frep"),
    env: require("gulp-env")
};

module.exports = $;
