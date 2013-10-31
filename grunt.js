/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    mincss: {
      compress: {
        files: {
          'css/hsl.css': ['deps/bootstrap/css/bootstrap.css', 'deps/bootstrap/css/bootstrap-responsive.css', 'deps/Font-Awesome/css/font-awesome.css', 'css/app.css', 'css/app-responsive.css']
        }
      }
    },
    lint: {
      files: ['new-hsl/grunt.js', 'new-hsl/js/**/*.js']
    },
    dojo: {
      hsl: {
        dojo: 'deps/dojo/dojo.js',
        profile: 'hsl.profile.js',
        'package': './',
        cwd: './'
      }
    },
    sprites: {
      social: {
        src: ['img/social/40x40/*.png'],
        css: '',
        map: 'img/social.png'
      }
    },
    reload: {
      port: 35729,
      liveReload: {}
    },
    watch: {
      files: ['new-hsl/index.html', 'new-hsl/js/**/*', 'new-hsl/css/**/*', 'new-hsl/dist/*.js'],
      tasks: 'reload'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-mincss');

  // Default task.
  grunt.registerTask('default', 'lint mincss dojo');

};
