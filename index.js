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


module.exports = (gulp, settings) => {

    'use strict';

    class Tasks {
        constructor(config, dependencies, kernel) {
            this.$ = dependencies(gulp);
            this.config = config(settings, this.$);
            this.kernel = kernel(gulp, this.config, this.$);
        }

        import(tasks) {
            tasks.forEach((task) => {
                return require(`./tasks/${task}`)(gulp, this.config, this.kernel, this.$);
            });
        }

        define(name, tasks, callbackTasks) {
            gulp.task(name, tasks, () => {
                if (callbackTasks !== undefined) {
                    this.$.runSequence(callbackTasks);
                }
            });
        }
    }

    // --- API ------------------------------------------------------------
    return new Tasks(config, $, kernel);

};
