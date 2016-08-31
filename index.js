/*
 |--------------------------------------------------------------------------
 | Nixin CLI
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */


module.exports = (gulp, settings) => {

    "use strict";

    class Tasks {
        constructor(config, dependencies, kernel) {
            this.config = config;
            this.$ = dependencies;
            this.kernel = kernel;
        }

        get(tasks) {
            tasks.forEach((task) => {
                return require("./tasks/" + task)(gulp, this.config, this.kernel, this.$);
            });
        }

        set(taskName, seriesTasks, parallelsTasks) {
            gulp.task(taskName, seriesTasks, () => {
                if (parallelsTasks !== undefined) {
                    $.runSequence(parallelsTasks)
                }
            });
        }
    }

    const config = require("./system/config");
    const $ = require("./system/lib");

    Object.assign(config, settings);

    const kernel = require("./system/kernel")(gulp, config, $);


    // --- API ------------------------------------------------------------
    return new Tasks(config, $, kernel);

};
