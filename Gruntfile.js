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
    watch: {
      hsl: {
        files: ['index.html', 'src/**/*', 'css/**/*', 'dist/*.js'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['cssmin']);


};
