module.exports = function (grunt) {

    "use strict";

    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        bannercss: "/*! =============================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * CSS Document\n" +
            " * @project    MAG Maps Main Page\n" +
            " * @file       main-concat.main.css\n" +
            " * @summary    css files that have been minified and concatenated\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %>\n" +
            " * @license    MIT\n" +
            " * ===============================================================\n" +
            " */",

        bannerjs: "/*! ========================================================================\n" +
            " * Maricopa Association of Governments\n" +
            " * JavaScript Document\n" +
            " * @project    MAG Maps Main Page\n" +
            " * @file       main-concat.min.js\n" +
            " * @summary    JavaScript files that have been minified and concatenated\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %>\n" +
            " * @license    MIT\n" +
            " * ========================================================================== */\n",

        jshint: {
            options: {
                jshintrc: true,
                reporter: require("jshint-stylish")
            },
            target: ["Gruntfile.js", "src/js/*.js"],
        },

        babel: {
            options: {
                sourceMaps: false,
                presets: ["@babel/preset-env"]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/js",
                    src: ["*.js"],
                    dest: "dist/js"
                }]
            }
        },

        uglify: {
            options: {
                banner: "<% var subtask = uglify[grunt.task.current.target]; %>" +
                    "\n/*! <%= subtask.name %> */",
                preserveComments: "true",
                mangle: false
            },
            task0: {
                name: "main.min.js",
                files: [{
                    src: "dist/js/main.js",
                    dest: "dist/js/master.min.js"
                }]
            },
        },


        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            release: {
                files: {
                    'dist/css/master.css': 'src/sass/main.scss'
                }
            }
        },

        cssmin: {
            options: {
                specialComments: "all",
                processImport: false,
                roundingPrecision: -1,
                mergeIntoShorthands: false,
                advanced: false,
            },
            release: {
                files: {
                    'dist/css/master.min.css': 'dist/css/master.css'
                }
            }
        },

        // postcss: {
        //     options: {
        //         map: false,
        //         processors: [
        //             require('pixrem')(),
        //             require('postcss-preset-env')()
        //         ]
        //     },
        //     release: {
        //         files: {
        //             'dist/css/master1.min.css': 'dist/css/master.min.css'
        //         }
        //     }
        // },

        // concat: {
        //     css: {
        //         options: {
        //             stripBanners: true,
        //             banner: "<%= bannercss %>\n"
        //         },
        //         src: ["dist/css/normalize.min.css", "dist/css/main.min.css"],
        //         dest: "dist/css/main-concat.min.css"
        //     }
        // },

        htmlmin: {
            htmlmin1: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    "dist/index.html": "dist/index.html",
                    "dist/releaseHistory.html": "dist/releaseHistory.html",
                    "dist/trainings.html": "dist/trainings.html"
                }
            },
            htmlmin2: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: "dist/views",
                    src: ["*.html"],
                    dest: "dist/views"
                }]
            }
        },

        clean: {
            build: {
                src: ["dist/"]
            },
            cleanjs: {
                src: ["dist/js/*.js", "!dist/js/master.min.js"]
            },
            cleancss: {
                src: ["dist/css/*.css", "!dist/css/master.min.css"]
            },
            cleansass: {
                src: ["dist/sass/"]
            }
        },

        copy: {
            build: {
                cwd: "src/",
                src: ["**"],
                dest: "dist/",
                expand: true,
                dot: true
            }
        },

        toggleComments: {
            customOptions: {
                options: {
                    removeCommands: true
                },
                files: {
                    "dist/index.html": "src/index.html",
                    "dist/releaseHistory.html": "src/releaseHistory.html",
                    "dist/trainings.html": "src/trainings.html",
                    "dist/js/main.js": "src/js/main.js"
                }
            }
        },

        replace: {
            update_Meta: {
                // source files array
                // RegExp Expression
                src: ["src/index.html", "src/trainings.html", "src/releaseHistory.html", "src/js/main.js", "src/humans.txt", "README.md", "LICENSE", "src/LICENSE"],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{4}-[0-9]{2}-[0-9]{2}(">)/g,
                    to: '<meta name="revision-date" content="' + "<%= pkg.date %>" + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + "<%= pkg.version %>" + '">',
                }, {
                    // html pages CSS
                    //<!-- <link rel="stylesheet" type="text/css" href="css/master.min.css?v=5.1.0"> -->
                    from: /(<!-- <link rel="stylesheet" type="text\/css" href="css\/master.min.css\?v=)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))("> -->)/g,
                    to: '<!-- <link rel="stylesheet" type="text/css" href="css/master.min.css?v=' + "<%= pkg.version %>" + '"> -->',
                }, {
                    // html pages JS
                    //<!-- <script src="js/master.min.js?v=5.1.0"></script> -->
                    from: /(<!-- <script src="js\/master.min.js\?v=)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))("><\/script> -->)/g,
                    to: '<!-- <script src="js/master.min.js?v=' + "<%= pkg.version %>" + '"></script> -->',
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + "<%= pkg.version %>",
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Last updated: " + "<%= pkg.date %>",
                }, {
                    // README.md
                    from: /(### version \| )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "### version \| " + "<%= pkg.version %>",
                }, {
                    // README.md
                    from: /(Updated \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Updated \| " + "<%= pkg.date %>"
                }, {
                    // main.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "v" + "<%= pkg.version %>" + " | " + "<%= pkg.date %>"
                }, {
                    // main.js    $(".copyright").html("2017");
                    from: /(.html)+(\(")([0-9]{4})+("\))/g,
                    to: '.html("' + "<%= pkg.copyright %>" + '")'
                }, {
                    // LICENSE
                    from: /(Copyright \(c\) )([0-9]{4})/g,
                    to: "Copyright (c) " + "<%= pkg.copyright %>",
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);
    grunt.registerTask("update", ["replace"]);

    grunt.registerTask("buildCSS", ["sass", "cssmin", "clean:cleancss", "clean:cleansass"]);
    grunt.registerTask("buildJS", ["uglify", "clean:cleanjs"]);

    grunt.registerTask("build", ["clean:build", "replace", "copy", "toggleComments", "htmlmin", "buildJS", "buildCSS"]);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
