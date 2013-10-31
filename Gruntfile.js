/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    cssmin: {
      hsl: {
        files: {
          'css/hsl.css': ['deps/bootstrap/css/bootstrap.css', 'deps/bootstrap/css/bootstrap-responsive.css', 'deps/Font-Awesome/css/font-awesome.css', 'css/app.css', 'css/app-responsive.css']
        }
      }
    },
    dojo: {
      hsl: {
        options: {
          dojo: 'deps/dojo/dojo.js',
          profile: 'hsl.profile.js',
          'package': './',
          cwd: './'
        }
      }
    },
    watch: {
      hsl: {
        files: ['index.html', 'js/**/*', 'css/**/*', 'dist/*.js'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      hsl: ['Gruntfile.js', 'js/**/*.js', '!js/lodash.templates.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['jshint', 'cssmin', 'dojo']);

};
