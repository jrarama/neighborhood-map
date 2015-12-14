(function() {
    'use strict';

    module.exports = function(grunt) {

        // Load grunt tasks
        require('load-grunt-tasks')(grunt);

        // Grunt configuration
        var config = {
            pkg: grunt.file.readJSON('package.json'),
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    keepSpecialComments: 0
                },
                main: {
                    files: {
                      './css/style.min.css': ['./css/style.css']
                    }
                },
            },
            jshint: {
                all: ['Gruntfile.js', './js/**/*.js', '!./js/**/*.min.js'],
                options: {
                    undef: true,
                    curly: true,
                    eqnull: true,
                    globals: {
                        document: false,
                        window: false,
                        require: false,
                        console: false,
                        module: false,
                        google: false,
                        jQuery: false,
                        ko: false
                    }
                }
            },
            uglify: {
                dist: {
                    files: {
                        'js/app.min.js': [
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/knockout/dist/knockout.js',
                            'js/app.js'
                        ]
                    }
                }
            },
            clean : {
                dist : ['bower_components/*/*', '!bower_components/*/dist']
            },
            watch: {
                scripts: {
                    files: ['./js/*.js', '!./js/*.min.js'],
                    tasks: ['jshint', 'uglify'],
                    options: {
                        livereload: true
                    }
                },
                styles: {
                    files: ['./css/*.css', '!./css/*.min.css'],
                    tasks: ['cssmin'],
                    options: {
                        livereload: true
                    }
                },
                bower: {
                    files: ['bower.json'],
                    tasks: ['clean']
                }
            }
        };

        grunt.initConfig(config);

        // Register default tasks
        grunt.registerTask('build', ['clean', 'uglify', 'cssmin']);
        grunt.registerTask('default', ['watch']);
    };
})();