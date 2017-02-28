// ----------------------------------------------------------------------
// Sprite
// ----------------------------------------------------------------------


import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import spritesmith from 'gulp.spritesmith-multi';
import buffer from 'vinyl-buffer';


module.exports = (gulp, config, kernel, $) => {

    'use strict';

    // Config
    // ---------------------------------------------------------

    // extending default config with project config
    Object.assign(config.sprites = {
        source: "/" + config.sprites,
        dest: "",
        inputExt: "{gif,jpg,jpeg,png,svg}",
        outputExt: "css"
    });

    // Public
    // ---------------------------------------------------------

    function clean() {
        gulp.task("clean:sprites", () => {
            $.del(kernel.setCleanStack("sprites"));
            $.del(`${config.destPublicDir}${config.dest}/images/sprite--*`);
        });
    }

    function create() {

        let opts = {
            // spritesmith: function (options, sprite, icons){
            //     if (sprite.indexOf('sprite--') !== -1) {
            //         // options.cssTemplate = themeTemplate
            //
            //         console.log(sprite);
            //         console.log(options);
            //     }
            //     return options
            // },

            imgName: 'sprite.png',
            cssName: 'sprite.css',
            engine: 'pixelsmith'

        };

        // var themeTemplate = $.spritesmith.util.createTemplate(
        //     $.path.join(__dirname, 'template', 'css.hbs'),
        //     [addTheme, $.spritesmith.util.addPseudoClass]
        // );
        //
        // function addTheme(data) {
        //     var info = data.spritesheet_info;
        //     var match = info.name.match(/hover--(\w+)/);
        //     data.theme = match && match[1];
        // }

        gulp.task("sprites", () => {
            return gulp.src(kernel.setSourceStack("sprites", config.sprites.inputExt))
                .pipe(spritesmith(opts))
                .pipe(buffer())
                .pipe($.rename((filepath) => {
                    kernel.rewritePath(filepath);
                }))
                // .pipe(kernel.addSuffixPath())
                .pipe(imagemin(pngquant(config.imagemin.pngquant)))
                .pipe(gulp.dest(config.destPublicDir + config.dest))
                .pipe($.size({
                    showFiles: true
                }));
        });
    }

    return {
        clean: clean(),
        create: create()
    };
};
