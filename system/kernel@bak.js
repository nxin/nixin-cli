// ----------------------------------------------------------------------
// Kernel
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = (gulp, config, $) => {

    function extendTask(taskName, seriesTasks, parallelsTasks) {
        gulp.task(taskName, seriesTasks, () => {
            if (parallelsTasks !== undefined){
                $.runSequence(parallelsTasks)
            }
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

        switch(taskName) {
            case "images":
                taskPath = config.images.dest + "/";
                break;

            case "fonts":
                taskPath = config.fonts.dest + "/";
                break;

            default:
                break;
        }

        if(config.tree === "flatten"){
            cleanStack.push(config.dest + taskPath + filename + "*." + config[taskName].outputExt)
        }

        if(config.tree === "tree"){
            if (filename !== "") {
                filename = "/" + filename;
                if (taskPath === "/") {
                    taskPath = "";
                } else {
                    filename = filename + "/";
                }
            }

            cleanStack.push(config.dest + "/**" + filename + taskPath + "*." + config[taskName].outputExt)
        }

        return cleanStack;
    }

    function setSourceStack(taskName, inputExt) {
        return [
            config.source + config[taskName].source + "{/sprite--*/*.,/*.}" + inputExt,
            config.source + "{/theme--*,/context--*,/theme--*/context--*}" + config[taskName].source + "{/sprite--*/*.,/*.}" + inputExt,
            // config.source + "{/theme--!(default),/context--!(common),/theme--!(default)/context--!(common)}" + config[taskName].source + "/*." + inputExt
        ];
    }

    function setSuffixPath(filepath, pathPosition){

        var dir = filepath.dirname.split("/");
        var path = "";
        var divider = function(){
           if(pathPosition === "prefix"){
               return "-";
           }
           else {
               return "/";
           }
        };

        if (dir[1] !== undefined) {
            if (dir.length === 2) {
                path = divider() + dir[0];
            }
            else {
                path = divider() + dir[0] + divider() + dir[1];
            }
        }

        return path;
    }

    function cleanSuffixPath(suffix) {
        return suffix.replace("theme--", "").replace("context--", "");
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

                var suffixPath = setSuffixPath(filepath, "suffix");

                if (filename !== undefined) {
                    filepath.basename = setTaskPath(filepath) + $.path.basename(filename) + suffixPath;
                }

                else {
                    filepath.basename = setTaskPath(filepath) + filepath.basename + suffixPath;
                }
            }

            else if (config.tree === "tree") {

                var prefixPath = setSuffixPath(filepath, "prefix") + setTaskPath(filepath);

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

    function addSuffixPath() {

        function patterns(fileSuffix) {
            return [
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(jpeg|jpg|gif|png|svg)))/ig,
                    replacement: './images/$2' + fileSuffix + '$3'
                },
                {
                    pattern: /[^'"()]*(\/([\w-]*)(\.(woff2|woff|ttf|svg|eot)))/ig,
                    replacement: './fonts/$2' + fileSuffix + '$3'
                }
            ];
        }

        function transform(file, cb) {

            var fileContentTrimmed = String(file.contents).trim();
            // var fileSuffix = file.path.split(config.app)[1].split(".css")[0];

            var fileSuffix = "";

            console.log(file.path);

            if(file.path.indexOf("sprite--") !== -1){
                console.log(file.path + " => sprite!!!");
                fileSuffix = file.path.split("sprite--")[1].split(".png")[0];
            }
            else if(file.path.indexOf(config.app) !== -1){
                console.log("app!!!!");
                fileSuffix = file.path.split(config.app)[1].split(".css")[0];
            }


            fileSuffix = cleanSuffixPath(fileSuffix);

            fileContentTrimmed = $.frep.strWithArr(fileContentTrimmed, patterns(fileSuffix));
            file.contents = new Buffer(fileContentTrimmed);

            // if there was some error, just pass as the first parameter here
            cb(null, file);
        }

        return $.eventStream.map(transform);
    }

    return {
        extendTask: extendTask,
        errors: errors,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        rewritePath: rewritePath,
        addSuffixPath: addSuffixPath
    };

};
