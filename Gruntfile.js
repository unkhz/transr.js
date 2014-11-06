/*jshint undef:false*/
module.exports = function(grunt) {
  // Load task deps
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Configure
  var
    pkg = grunt.file.readJSON('package.json'),
    files = [
      'transr.js',
    ],
    dir = {
      src: '',
      dist: 'dist'
    },
    config = {
      pkg:pkg, files:files, dir:dir,
      uglify : {
        unminified : {
          options: {
            banner:grunt.file.read('DISCLAIMER'),
            preserveComments:true,
            mangle:false,
            compress:false,
            beautify:true
          },
          files: {
            '<%= dir.dist %>/transr.js': files
          }
        },
        minified : {
          options: {
            banner:grunt.file.read('DISCLAIMER'),
            report:'gzip',
            preserveComments:false,
            mangle:true,
            compress:true,
            beautify:false
          },
          files: {
            '<%= dir.dist %>/transr.min.js': files
          }
        }
      },
      clean: {
        all: [dir.dist]
      },
      watch: {
        js: {
          files : files.concat('<%= dir.test %>/**/*'),
          tasks : 'release'
        }
      }
    };

  // Initialize
  grunt.initConfig(config);

  // Export tasks
  grunt.registerTask('release', ['clean', 'uglify']);
  grunt.registerTask('default', ['release']);
};
