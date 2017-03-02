/*
 |--------------------------------------------------------------------------
 | Nixin CLI
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */

import $ from './system/lib';
import config from './system/config';
import kernel from './system/kernel';
import tasks from './tasks';


module.exports = (gulp, settings) => {

    'use strict';


    class Tasks {

        constructor(config, dependencies, kernel) {
            this.$ = dependencies(this.nix);
            this.config = config(settings, this.$);
            this.kernel = kernel(gulp, this.config, this.$);
        }

        import(activeTasks) {

            let nix = {
                config: this.config,
                kernel: this.kernel,
                $: this.$,
                settings: settings,
                tasks: activeTasks
            };

            return tasks(gulp, nix);
        }

        define(name, tasks, callbackTasks) {
            this.kernel.extendTask(name, tasks, callbackTasks);
        }
    }

    // --- API ------------------------------------------------------------
    return new Tasks(config, $, kernel);

};
