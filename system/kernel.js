// ----------------------------------------------------------------------
// Kernel
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, $) => {

    function getSources(filename, string) {
        var src = $.stream.Readable({objectMode: true});

        src._read = function () {
            this.push(new $.gutil.File({
                cwd: "",
                base: "",
                path: filename,
                contents: new Buffer(string)
            }));
            this.push(null);
        };

        return src
    }

    function extendTask(taskName, seriesTasks, parallelsTasks, cb) {
        gulp.task(taskName, seriesTasks, () => {
            if (parallelsTasks !== undefined) {
                $.runSequence(parallelsTasks)
            }
        });
    }

    function getErrors(res) {
        $.gutil.log("in result");
        console.log(res);
        res.on("end", () => {
            console.log('res.end');
            cb();
        });
        res.on("data", () => {
            console.log("res.data");
        });
    }

    function errors() {
        // Send error to notification center with gulp-notify
        $.notify.onError({
            title: "Compile Error",
            message: "<%= error %>"
        }).apply(this, Array.prototype.slice.call(arguments));

        // Keep gulp from hanging on this task
        this.emit("end");
    }

    function setCleanStack(taskName, filename = "") {

        var cleanStack = [];
        var taskPath = "/";

        switch (taskName) {
            case "images":
                taskPath = config.images.dest + "/";
                break;

            case "fonts":
                taskPath = config.fonts.dest + "/";
                break;

            default:
                break;
        }

        if (config.tree === "flatten") {
            cleanStack.push(config.destPublicDir + config.dest + taskPath + filename + "*." + config[taskName].outputExt)
        }

        if (config.tree === "tree") {
            if (filename !== "") {
                filename = "/" + filename;
                if (taskPath === "/") {
                    taskPath = "";
                } else {
                    filename = filename + "/";
                }
            }

            cleanStack.push(config.destPublicDir + config.dest + "/**" + filename + taskPath + "*." + config[taskName].outputExt)
        }

        return cleanStack;
    }

    function setSourceStack(taskName, inputExt, middlePath) {
        let globPath = "";

        switch (taskName) {
            case "images":
            case "fonts":
            case "sprites":
                globPath = "{/**/*.,/*.}";
                break;
            default:
                globPath = "/*.";
                break;
        }

        return [
            config.source + config[taskName].source + globPath + inputExt,
            config.source + "{/theme--*,/context--*,/theme--*/context--*}" + config[taskName].source + globPath + inputExt
        ];
    }

    function setPathSuffix(filepath) {

        var dir = filepath.dirname.split("/");
        var path = "";

        if (dir[1] !== undefined) {
            if (dir.length === 2) {
                path = "-" + dir[0];
            }
            else {
                path = "-" + dir[0] + "-" + dir[1];
            }
        }

        return path;
    }

    function setPathPrefix(filepath) {

        var dir = filepath.dirname.split("/");
        var path = "";

        if (dir[1] !== undefined) {
            if (dir.length === 2) {
                path = "/" + dir[0] + "/";
            }
            else {
                path = "/" + dir[0] + "/" + dir[1] + "/";
            }
        }

        return path;
    }

    function cleanSuffixPath(suffix) {
        return suffix.replace("theme--", "").replace("context--", "").replace("//", "/");
    }

    function setTaskPath(filepath) {

        var taskPath = "";

        if (config.images.regExt.test(filepath.extname) === true) {
            taskPath = config.images.dest + "/";
        }

        if (config.fonts.regExt.test(filepath.extname) === true) {
            taskPath = config.fonts.dest + "/";
        }

        return taskPath;
    }

    function rewritePath(filepath, filename) {

        if (typeof filepath.basename !== "function") {

            if (config.tree === "flatten") {

                var suffixPath = setPathSuffix(filepath);

                if (filename !== undefined) {
                    filepath.basename = setTaskPath(filepath) + $.path.basename(filename) + suffixPath;
                }

                else {
                    filepath.basename = setTaskPath(filepath) + filepath.basename + suffixPath;
                }
            }

            else if (config.tree === "tree") {
                let pathPrefix = setPathPrefix(filepath);
                let taskPath = setTaskPath(filepath);
                let prefixPath = "";

                if (pathPrefix.indexOf(taskPath) !== -1) {
                    prefixPath = pathPrefix;
                } else {
                    prefixPath = pathPrefix + taskPath;
                }

                if (filename !== undefined) {
                    filepath.basename = prefixPath + $.path.basename(filename);
                }

                else {
                    filepath.basename = prefixPath + filepath.basename;
                }
            }

            filepath.dirname = "";
            filepath.basename = cleanSuffixPath(filepath.basename);
        }

        return filepath;
    }

    function addSuffixPath(isVendor = null) {

        function patterns(fileSuffix) {

            // set vendor path
            if (isVendor === "vendor") {
                return [{
                    pattern: /[^'"()]*(\/[\w-]*(\.(jpeg|jpg|gif|png|woff2|woff|ttf|svg|eot)))/ig,
                    replacement: config.dest + '/vendor$1'
                }]
            }

            /// @start !!!
            /// svg extension bug must be only in one pattern
            /// replacement override styles image prefix path
            /// temporary prefix path with config[typePath] doesn't works
            return [
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig,
                    replacement: config.dest + '/images/$2' + fileSuffix + '$3'
                },
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(woff2|woff|ttf|eot)))/ig,
                    replacement: config.dest + '/fonts/$2' + fileSuffix + '$3'
                }
            ];
            /// @end !!!
        }

        function transform(file, cb) {

            var fileContentTrimmed = String(file.contents).trim();

            // var fileSuffix = file.path.split(config.app)[1].split(".css")[0];
            var fileSuffix = "";

            if (file.path.indexOf("sprite--") !== -1) {
                fileSuffix = file.path.split("sprite--")[1].split(".png")[0];
            }
            else if (file.path.indexOf(config.app) !== -1) {
                fileSuffix = file.path.split(config.app)[1].split(".css")[0];
            }

            fileSuffix = cleanSuffixPath(fileSuffix);

            if (config.tree === "tree" || isVendor === "vendor") {
                fileContentTrimmed = $.frep.strWithArr(fileContentTrimmed, patterns(fileSuffix));
            }

            file.contents = new Buffer(fileContentTrimmed);

            // if there was some error, just pass as the first parameter here
            cb(null, file);
        }

        return $.eventStream.map(transform);
    }

    return {
        getSources: getSources,
        extendTask: extendTask,
        getErrors: getErrors,
        errors: errors,
        setPathSuffix: setPathSuffix,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        rewritePath: rewritePath,
        addSuffixPath: addSuffixPath
    };

};
