// ----------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, $, _) {

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

    function setPathSuffix(dir, divider) {

        var path = null;

        if (dir[0] === ".") path = "";
        else if (dir[1] === undefined) path = divider + dir[0];
        else path = divider + dir[0] + divider + dir[1];

        return path;
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

    function rewritePath(getPath, filepath, filename) {

        var dirPath = getPath.dirname(filepath.dirname).split("/");

        if(filename !== undefined) {
            filepath.basename = getPath.basename(filename) + setPathSuffix(dirPath, ".");
        }
        else{
            filepath.basename = filepath.basename + setPathSuffix(dirPath, ".");
        }

        filepath.dirname = "";

        // console.log(filepath);
        // console.log(filename);
    }

    function setCleanStack(taskName, filename){

        return [
            config.dest + "/" + filename + "*." + config[taskName].outputExt
        ]
    }

    return {
        errors: errors,
        getGitHash: getGitHash,
        rewritePath: rewritePath,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack
    };

};
