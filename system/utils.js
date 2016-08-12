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

    function setSourceStack(taskName, filesExt) {

        // console.log(config[taskName]);
        // console.log(config.source + config[taskName].paths + filesExt);

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

        var dir = $.path.dirname(filepath.dirname).split("/");

        var path = null;

        if (dir[0] === ".") path = "";
        else if (dir[1] === undefined) path = "." + dir[0];
        else path = "." + dir[0] + "." + dir[1];

        process.env.path = path;

        return path;
    }

    function replacePath(streamOutput){

        console.log(streamOutput);

        // return $.replace(/[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig, './images/$2' + suffixPath + '$3');
    }

    function rewritePath(filepath, filename) {

        // console.log("filepath ========>")
        // console.log(filepath);

        var suffixPath = setPathSuffix(filepath);

        if(filename !== undefined) {
            filepath.basename = $.path.basename(filename) + suffixPath;
        }
        else{
            filepath.basename = filepath.basename + suffixPath;
        }

        filepath.dirname = "";

        // console.log("rewrite => " + suffixPath);

        return suffixPath;

        // console.log(filepath);
        // console.log(filename);

        // return suffixPath;
    }

    function setCleanStack(taskName, filename){
        return [
            config.dest + "/" + filename + "*." + config[taskName].outputExt
        ]
    }

    return {
        errors: errors,
        getGitHash: getGitHash,
        setPathSuffix: setPathSuffix,
        rewritePath: rewritePath,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        parsePath: parsePath,
        replacePath: replacePath
    };

};
