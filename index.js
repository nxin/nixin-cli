/*
 |--------------------------------------------------------------------------
 | Nixin CLI
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */


module.exports = (gulp, settings) => {

    // --- Dependencies ----------------------------------------------------
    var _ = require("underscore"),
        $ = require("./system/lib"),
        config = require("./system/config");

    // --- Config ----------------------------------------------------------
    _.extend(config, settings);

    // --- Utils -----------------------------------------------------------
    var utils = require("./system/utils")(gulp, config, $, _);

    // --- Public ----------------------------------------------------------

    function run(tasks) {
        tasks.forEach((task) => {
            require("./tasks/" + task)(gulp, config, utils, $, _);
        });
    }

    function extend(taskName, cb) {
        gulp.task(taskName, cb);
    }

    // --- API ------------------------------------------------------------
    return {
        run: run,
        extend: extend
    };

};
