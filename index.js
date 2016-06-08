/*
 |--------------------------------------------------------------------------
 | Nix CLI
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */

module.exports = function(gulp, settings) {

    // --- Dependencies ----------------------------------------------------
    var _ = require("underscore"),
        $ = require("./shell/lib"),
        config = require("./shell/config"),
        utils = require("./shell/utils"),
        routes = require("./shell/routes");

    // --- Config ----------------------------------------------------------
    _.extend(config, settings);

    // --- Public ----------------------------------------------------------

    function run(tasks) {
        tasks.forEach(function(task){
            require("./tasks/" + task)(gulp, config, routes, utils, $, _);
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
