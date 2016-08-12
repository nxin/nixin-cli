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

    function setCleanStack(taskName, filename){
        return [
            config.dest + "/" + filename + "*." + config[taskName].outputExt
        ]
    }

    function setSourceStack(taskName, filesExt) {

        var ext = filesExt || "";

        return [
            config.source + config[taskName].paths + ext,
            config.source + "{/theme--!(default),/theme--!(default)/context--!(common)}" + config[taskName].paths + ext
        ];
    }

    function parsePath(path) {
        var extname = Path.extname(path);
        return {
            dirname: Path.dirname(path),
            basename: Path.basename(path, extname),
            extname: extname
        };
    }

    function setPathSuffix(filepath) {

        // console.log(filepath);

        var dir = filepath.dirname.split("/");
        //
        // console.log(dir);

        var path = "";

        if (dir[0] === ".") path = "";
        else if (dir[1] === undefined) path = "." + dir[0];
        else path = "." + dir[0] + "." + dir[1];

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
                    replacement: './images/$2' + suffixPath + '$3'
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

        return require('event-stream').map(transform);
    }

    return {
        errors: errors,
        getGitHash: getGitHash,
        setPathSuffix: setPathSuffix,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        rewritePath: rewritePath,
        parsePath: parsePath,
        addSuffixPath: addSuffixPath
    };

};
