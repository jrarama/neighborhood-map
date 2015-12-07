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
                        module: false
                    }
                }
            },
            clean : {
                dist : ['bower_components/*/*', '!bower_components/*/dist']
            },
            watch: {
                scripts: {
                    files: ['./js/*.js'],
                    tasks: ['jshint'],
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
        grunt.registerTask('default', ['watch']);
    };
})();