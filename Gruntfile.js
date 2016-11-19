/*jshint undef:false*/
module.exports = function(grunt) {
  // Load task deps
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

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
            banner:grunt.file.read('DISCLAIMER').replace('* Transr.js', '* Transr.js v' + pkg.version),
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
            banner:grunt.file.read('DISCLAIMER').replace('* Transr.js', '* Transr.js v' + pkg.version),
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
      jsdoc2md: {
        oneOutputFile: {
          options: {
            index: true
          },
          src: "transr.js",
          dest: "dist/docs.md"
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
  grunt.registerTask('release', ['clean', 'uglify', 'jsdoc2md']);
  grunt.registerTask('default', ['release']);
};
