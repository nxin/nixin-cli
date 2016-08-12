// ----------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, $, _, ext) {

    var spawn = require("child_process").spawn;

    function errors() {
        // Send error to notification center with gulp-notify
        $.notify.onError({
            title: "Compile Error",
            message: "<%= error %>"
        }).apply(this, Array.prototype.slice.call(arguments));

        // Keep gulp from hanging on this task
        this.emit("end");
    }

    function getGitHash() {
        var gitVersion = "na";
        gulp.task("version", function() {
            //git --git-dir=.git log --pretty='%ct %h' -1
            //git --git-dir=.git log --pretty='%h' -1

            var child = spawn("git", ["--git-dir=.git", "log", "--pretty=%h", "-1"], {
                    cwd: process.cwd()
                }),
                stdout = "",
                stderr = "";

            child.stdout.setEncoding("utf8");
            child.stdout.on("data", function(data) {
                stdout += data;
            });

            child.stderr.setEncoding("utf8");
            child.stderr.on("data", function(data) {
                stderr += data;
            });

            child.on("close", function(code) {
                var gitVersion = stdout.replace(/(?:\r\n|\r|\n)/g, "");
            });

            return gitVersion;
        });
    }

    function setCleanStack(taskName, partialPath){
        return [
            config.dest + "/" + partialPath + "*." + config[taskName].outputExt
        ]
    }

    function setSourceStack(taskName, inputExt) {
        return [
            config.source + config[taskName].source + "/*." + inputExt,
            config.source + "{/theme--!(default),/context--!(common),/theme--!(default)/context--!(common)}" + config[taskName].source + "/*." + inputExt
        ];
    }

    function setPathSuffix(filepath) {

        var dir = filepath.dirname.split("/");
        var path = "";

        switch (dir[1]) {
            case undefined:
                if (dir[0] !== undefined && dir[0] !== ".") {
                    path = "." + dir[0];
                }
                break;
            default:
                if (dir.length === 2) {
                    path = "." + dir[0];
                } else {
                    path = "." + dir[0] + "." + dir[1];
                }

                break;
        }

        return path;
    }

    function rewritePath(filepath, filename) {

        if (typeof filepath.basename !== "function") {
            var suffixPath = setPathSuffix(filepath);

            if(filename !== undefined) {
                filepath.basename = $.path.basename(filename) + suffixPath;
            }
            else{
                filepath.basename = filepath.basename + suffixPath;
            }
            filepath.dirname = "";
        }

        return filepath;
    }

    function addSuffixPath(){

        function patterns(suffixPath){
            return [
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig,
                    replacement: './images/$2' + suffixPath + '$3'
                },
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(woff2|woff|ttf|svg|eot)))/ig,
                    replacement: './fonts/$2' + suffixPath + '$3'
                }
            ];
        }

        function transform(file, cb) {

            var suffix = file.path.split(config.app)[1].split(".css")[0];
            var fileContentTrimmed = String(file.contents).trim();

            fileContentTrimmed = $.frep.strWithArr(fileContentTrimmed, patterns(suffix));
            file.contents = new Buffer(fileContentTrimmed);

            // if there was some error, just pass as the first parameter here
            cb(null, file);
        }

        return $.eventStream.map(transform);
    }

    return {
        errors: errors,
        getGitHash: getGitHash,
        setPathSuffix: setPathSuffix,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        rewritePath: rewritePath,
        addSuffixPath: addSuffixPath
    };

};
