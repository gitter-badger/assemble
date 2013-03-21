/*
 * Assemble
 * http://github.com/assemble/assemble
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */


module.exports = function(grunt) {

  'use strict';
  
  // Project configuration.
  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    // Run mocha tests.
    mochaTest: {
      files: ['test/**/*.{js,!yml}']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'
      }
    },

    assemble: {
      // Run basic tests on templates and data.
      tests: {
        options: {
          layout: 'test/files/layout-includes.hbs'
        },
        files: {
          'test/actual': ['test/files/extend.hbs', 'test/files/helpers.hbs']
        }
      },
      yaml: {
        options: {
          layout: 'test/files/layout.hbs',
          partials: 'test/files/alert.hbs'
        },
        files: {
          'test/actual/yaml': ['test/yaml/*.hbs']
        }
      },
      // Internal task to build README, docs.
      readme: {
        options: {
          today: '<%= grunt.template.today() %>',
          partials: ['docs/*.md','docs/templates/sections/*.{md,hbs}'],
          changelog: grunt.file.readYAML('CHANGELOG'),
          roadmap: grunt.file.readYAML('ROADMAP'),
          ext: '.md',
          data: [
            'docs/templates/data/docs.json',
            '../assemble-internal/docs/templates/data/url.json', 
            '../assemble-internal/docs/templates/data/repos.json'
          ]
        },
        files: {
          '.': ['docs/templates/README.hbs']
        }
      },
      // Internal task to build wiki.
      wiki: {
        options: {
          today: '<%= grunt.template.today() %>',
          partials: ['docs/wiki/partials/*.md'],
          changelog: grunt.file.readYAML('CHANGELOG'),
          roadmap: grunt.file.readYAML('ROADMAP'),
          ext: '.md',
          data: [
            'docs/templates/data/docs.json',
            '../assemble-internal/docs/templates/data/url.json', 
            '../assemble-internal/docs/templates/data/repos.json'
          ]
        },
        files: {
          '.': ['docs/templates/README.hbs']
        }
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', [
    'assemble:tests',
    'assemble:yaml',
    'jshint'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);
};
