// ----------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------

/*jshint esversion: 6 */

module.exports = function (gulp, config, $, _) {

    function errors() {
        // Send error to notification center with gulp-notify
        $.notify.onError({
            title: "Compile Error",
            message: "<%= error %>"
        }).apply(this, Array.prototype.slice.call(arguments));

        // Keep gulp from hanging on this task
        this.emit("end");
    }

    function setCleanStack(taskName, partialPath){
        return [
            config.dest + "/" + partialPath + "*." + config[taskName].outputExt
        ]
    }

    function setSourceStack(taskName, inputExt) {
        return [
            config.source + config[taskName].source + "/*." + inputExt,
            config.source + "{/theme--*,/context--*,/theme--*/context--*}" + config[taskName].source + "/*." + inputExt
            // config.source + "{/theme--!(default),/context--!(common),/theme--!(default)/context--!(common)}" + config[taskName].source + "/*." + inputExt
        ];
    }

    function setPathSuffix(filepath) {

        var dir = filepath.dirname.split("/");
        var path = "";

        switch (dir[1]) {
            case undefined:
                if (dir[0] !== undefined && dir[0] !== ".") {
                    path = "__" + dir[0];
                }
                break;
            default:
                if (dir.length === 2) {
                    path = "__" + dir[0];
                } else {
                    path = "__" + dir[0] + "__" + dir[1];
                }

                break;
        }

        return path;
    }

    function cleanSuffixPath(suffix){
        return suffix.replace("theme--", "").replace("context--", "");
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

        filepath.basename = cleanSuffixPath(filepath.basename);

        // console.log(filepath.basename);

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

            suffix = cleanSuffixPath(suffix);

            // console.log(suffix);

            fileContentTrimmed = $.frep.strWithArr(fileContentTrimmed, patterns(suffix));
            file.contents = new Buffer(fileContentTrimmed);

            // if there was some error, just pass as the first parameter here
            cb(null, file);
        }

        return $.eventStream.map(transform);
    }

    return {
        errors: errors,
        setPathSuffix: setPathSuffix,
        setSourceStack: setSourceStack,
        setCleanStack: setCleanStack,
        rewritePath: rewritePath,
        addSuffixPath: addSuffixPath
    };

};
