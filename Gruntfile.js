(function() {
    'use strict';

    module.exports = function(grunt) {

        // Load grunt tasks
        require('load-grunt-tasks')(grunt);

        // Grunt configuration
        var config = {
            pkg: grunt.file.readJSON('package.json'),
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
                bower: {
                    files: ['bower.json'],
                    tasks: ['clean']
                }
            }
        };

        grunt.initConfig(config);

        // Register default tasks
        grunt.registerTask('build', ['clean', 'uglify']);
        grunt.registerTask('default', ['watch']);
    };
})();