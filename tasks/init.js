// ----------------------------------------------------------------------
// Init
// ----------------------------------------------------------------------


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    let create = () => {
        gulp.task("init", () => {
            let pkg = require('package.json');

            // return kernel.getSources("version", pkg.version)
            //     .on("data", (file) => {
            //         console.log(file);
            //     });


            return gulp.src("testFS.js")
                .on("data", (file) => {
                    console.log(file.cwd);
                    console.log(file.base);
                    console.log(file.path);

                    $.fs.readFile(file.path, "utf-8", function (err, _data) {
                        //do something with your data
                        console.log(file.source);
                    });

                    // var obj = JSON.parse($.fs.readFileSync(file.contents, 'utf8'));
                    // var fileContents = JSON.parse(String(file.contents).trim());

                    //

                    // console.log(obj);
                    //
                    // console.log(fileContents);

                    console.log(JSON.stringify(file));
                })
                .pipe($.through.obj(function (chunk, enc, callback) {
                    console.log(chunk.path);
                    console.log(String(chunk.contents).trim());
                }))
                .pipe($.prompt.prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: 'First question?',
                        // validate: function (pass) {
                        //     if (pass !== '123456') {
                        //         return false;
                        //     }
                        //
                        //     return true;
                        // }
                    },
                    {
                        type: 'input',
                        name: 'second',
                        message: 'Second question?'
                    }
                ], function (res) {

                    console.log(res);

                }))
                .pipe(gulp.dest(config.destPublicDir + config.dest));
        });
    };

    return {
        init: init
    };

};
