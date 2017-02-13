// ----------------------------------------------------------------------
// Lib
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

let gulp = require("gulp");

$ = {
    fs: require("fs"),
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
    colors: require("chalk"),
    hashmark: require("hashmark"),
    path: require("path"),
    merge: require("merge-stream"),
    stream: require("stream"),
    through: require("through2"),
    frep: require("frep"),
    eventStream: require("event-stream"),
    debug: require("gulp-debug"),
    // phantomjssmith: require("phantomjssmith"),
    prompt: require("gulp-prompt"),
    plumber: require("gulp-plumber")
};

module.exports = $;
