// ----------------------------------------------------------------------
// Lib
// ----------------------------------------------------------------------

import fs from 'fs';
import del from 'del';
import browserSync from 'browser-sync';
import size from 'gulp-size';
import rename from 'gulp-rename';
import gulpIF from 'gulp-if';
import argv from 'yargs';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import gutil from 'gulp-util';
import colors from 'chalk';
import hashmark from 'hashmark';
import path from 'path';
import merge from 'merge-stream';
import stream from 'stream';
import through from 'through2';
import frep from 'frep';
import eventStream from 'event-stream';
import debug from 'gulp-debug';
import prompt from 'gulp-prompt';
import plumber from 'gulp-plumber';
//import phantomjssmith from 'phantomjssmith';


module.exports = (gulp) => {
    return {
        fs: fs,
        del: del,
        browserSync: browserSync.create(),
        size: size,
        rename: rename,
        if: gulpIF,
        argv: argv.argv,
        runSequence: runSequence.use(gulp),
        shell: shell,
        gutil: gutil,
        colors: colors,
        hashmark: hashmark,
        path: path,
        merge: merge,
        stream: stream,
        through: through,
        frep: frep,
        eventStream: eventStream,
        debug: debug,
        // phantomjssmith: phantomjssmith,
        prompt: prompt,
        plumber: plumber
    };
};
