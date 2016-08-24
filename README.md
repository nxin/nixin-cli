# Nixin CLI

A bunch of useful configurable Gulp tasks global to many projects,
to manage development and production tasks with ease.

- Asset pipeline for Stylus, JavaScript, Images, Sprites, Fonts and Pug(Jade) templates that does compilation with sourcemaps
and syntax checking in development mode and minification with obfuscator for production mode
- Advanced Bower integration
- Watch changed files with [BrowserSync](https://www.browsersync.io/) integration
- Mail inliner
- Project tasks extend or override
- Themes bundler 
- Context bundler

![alt=gulp](https://raw.githubusercontent.com/kreo/nixin-cli/master/public/gulp.png)
![alt=bower](https://raw.githubusercontent.com/kreo/nixin-cli/master/public/bower.png)
![alt=browser-sync](https://raw.githubusercontent.com/kreo/nixin-cli/master/public/browser-sync.png)
![alt=browserify](https://raw.githubusercontent.com/kreo/nixin-cli/master/public/browserify.png)
![alt=browserify](https://raw.githubusercontent.com/kreo/nixin-cli/master/public/npm.png)

```bash

 __ _  _   __ __ __ _
|  | || | / /| ||  | |
|_|__||_|/_/_|_||_|__|

 Main Tasks
 ------------------------------
     bower
     browserify
     build
     clean
     default
     fonts
     images
     mail
     pug
     serve
     sprites
     stylus

 Sub Tasks
 ------------------------------
     build:serve
     clean:bower.fonts
     clean:bower.images
     clean:bower.install
     clean:bower.scripts
     clean:bower.styles
     clean:browserify
     clean:fonts
     clean:images
     clean:mail
     clean:pug
     clean:sass
     clean:sprites
     clean:stylus
     convert:mail.styles
     create:bower.fonts
     create:bower.images
     create:bower.scripts
     create:bower.styles
     create:mail.styles
     create:sass
     inline:mail.styles
     install:bower
     serve:sync
     serve:watch

## Get Started

Before get started with nixin-cli, verify that you have installed node

```bash
$ which node
```

if are not installed, install it with brew

```bash
$ brew install node
```


Or through n (node version manager)

```bash
$ curl -L http://git.io/n-install | bash
```


Then install nixin-cli

```bash
$ sudo npm install -g nixin-cli
```

Or clone the repo and then create symlink into global node_modules
and set into your .bashrc or .zshenv the global node_modules path

```bash
$ git clone git@github.com:kreo/nixin-cli.git
$ cd path/to/nixin-cli
$ npm link
export NODE_PATH=/path/to/node_modules/
```

## Usage

To use:

Create a bower.json into your project root

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "authors": [
    "Name-1",
    "Name-2"
  ],
  "description": "",
  "main": "",
  "moduleType": [
    "amd"
  ],
  "keywords": [],
  "license": "MIT",
  "homepage": "http://project-name.com",
  "private": true,
  "ignore": [
    "**/.*",
    "*.map",
    "*.json",
    "*.md",
    "*.editorconfig",
    "*.yml",
    "bower_components",
    "node_modules",
    "media",
    "test",
    "tests"
  ],
  "dependencies": {
    "plugin-1": "~number-version",
    "plugin-2": "~number-version"
  },
  "devDependencies": {},
  "resolutions": {
    "shim-plugin-1": "~number-version",
    "shim-plugin-2": "~number-version"
  },
  "install": {
    "base": "path/to/static",
    "path": "name_vendor_folder",
    "sources": {
      "plugin-1": [
        "bower_components/path/to/plugin-1.js",
        "bower_components/path/to/plugin-1.css",
        "bower_components/path/to/fonts/*.**",
        "bower_components/path/to/*.{gif,png,jpg,jpeg,svg}"
      ],
      "plugin-2": [
        "bower_components/path/to/plugin-2.js",
        "bower_components/path/to/plugin-2.css",
        "bower_components/path/to/fonts/*.**",
         "bower_components/path/to/*.{gif,png,jpg,jpeg,svg}"
      ]
    },
    "ignore": [
      "plugin-or-dependencies-to-ignore-1",
      "plugin-or-dependencies-to-ignore-2"
    ]
  }
}
```

Then run the gulp install that create the node_modules and bower_components dependencies

```bash
$ nix install:bower
```

Then create a nix at the same level

```javascript

/*
 |--------------------------------------------------------------------------
 | Nix - Settings
 |--------------------------------------------------------------------------
 | author: @kreo
 | https://github.com/kreo
 |
 */

/*jshint esversion: 6 */
"use strict";

import gulp from "gulp";
import rupture from "rupture";
import jeet from "jeet";
import rucksack from "rucksack-css";
import poststylus from "poststylus";


const nix = require("nixin-cli")(gulp, {
    source: __dirname + "/resources",
    dest: __dirname + "/public/_dist",
    app: "app",
    vendor: "vendor",
    mail: "mail",
    npm: {
        stylus: [
            rupture(),
            jeet(),
            poststylus(rucksack),
            typographic()
        ],
        browserify: []
    },
    bower: {
        assets: [
            "normalize-css",
            "bootstrap",
            "jquery.scrollbar",
            "slideout.js",
            "slick-carousel",
            "magnific-popup",
            "components-font-awesome",
            "simple-line-icons"
        ],
        order: [
            "jquery/*",
            "normalize-css/*",
            "tether/*",
            "bootstrap/*",
            "slick-carousel/*",
            "**/*.js"
        ]
    },
    serve: {
        host: "localhost",
        proxy: "localhost/",
        port: "9001"
    }
});


nix.run([
    "default",
    "stylus",
    "browserify",
    "images",
    "fonts",
    "bower",
    "serve"
]);

```

For verify if node_modules need an update install npm-check-updates

``` bash
$ npm install npm-check-updates -g
```

and then you can update all modules version running

``` bash
$ ncu
$ npm update -a
```

Now you must simpy include css and js dist into your base template

if tree dist structure is flatten

``` html
<link rel="stylesheet" href="path/to/static/_dist/app-{{ theme }}-{{ context }}.css">
<link rel="stylesheet" href="path/to/static/_dist/vendor.css">
...
<script src="path/to/static/_dist/vendor.js"></script>
<script src="path/to/static/_dist/app-{{ theme }}-{{ context }}.js"></script>
```

else if tree dist structure is tree

``` html
<link rel="stylesheet" href="path/to/static/{{ theme }}/{{ context }}/_dist/app.css">
<link rel="stylesheet" href="path/to/static/_dist/vendor.css">
...
<script src="path/to/static/_dist/vendor.js"></script>
<script src="path/to/static/{{ theme }}/{{ context }}/_dist/app.js"></script>
```

## Tasks

### default

Run this task to:

- print the tasks list

``` bash
nix
```

### Bower

This task create a vendor folder into your static with your plugins
(images, fonts, and various assets of your choice), then
create two files vendor.js and vendor.css and exports those (including assets) to dist folder.

``` bash
nix bower
```

### build

Run this task to:

- clean any already generated JS/CSS file
- compile your Stylus/SASS files to one unified file (with sourcemaps enabled)

and, parallelly:
- compile your JS browserify files to one unified file (with sourcemaps enabled)

``` bash
nix build
```

### serve

When you run this task, it will watch your project for changes.


``` bash
nix build:serve
```

### mail (in progress)

Run this task to:

- clean any already generated inlined mail templates
- inline your CSS class to multiple html templates

and, parallelly:
- inject your responsive style after the inliner
- convert your responsive style after the inject into style tag

``` bash
nix mail
```

## Flags

### Production Flag

Add flag "-p" || "--prod" || "--env=prod":

- clean any already generated JS/CSS file
- compile your Stylus/SASS files to one unified file and minified CSS file removing
sourcemaps

and, parallelly:
- compile your JS browserify files to one unified file and uglified and obfuscated JS file removing
  sourcemaps

``` bash
nix build -p
```


## License

This project is released under the MIT license.
