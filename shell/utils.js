// ----------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (function (gulp, config, routes, $, _) {

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

    return {
        errors: errors,
        getGitHash: getGitHash
    };

})();
