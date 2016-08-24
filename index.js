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
    const _ = require("underscore"),
        $ = require("./system/lib"),
        config = require("./system/config");

    // --- Config ----------------------------------------------------------
    _.extend(config, settings);

    // --- Kernel -----------------------------------------------------------
    const kernel = require("./system/kernel")(gulp, config, $, _);

    // --- Public ----------------------------------------------------------

    function run(tasks) {
        tasks.forEach((task) => {
            require("./tasks/" + task)(gulp, config, kernel, $, _);
        });
    }

    // --- API ------------------------------------------------------------
    return {
        run: run,
        extend: kernel.extendTask
    };

};
