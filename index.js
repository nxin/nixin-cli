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
    const $ = require("./system/lib"),
          config = require("./system/config");

    // --- Config ----------------------------------------------------------
    Object.assign(config, settings);

    // --- Kernel -----------------------------------------------------------
    const kernel = require("./system/kernel")(gulp, config, $);

    // --- Public ----------------------------------------------------------

    function run (tasks) {
        tasks.forEach((task) => {
            require("./tasks/" + task)(gulp, config, kernel, $);
        });
    }

    // --- API ------------------------------------------------------------
    return {
        run: run,
        extend: kernel.extendTask
    };

};
