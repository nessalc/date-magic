module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      dev: {
        src: ['Gruntfile.js', 'src/js/**/*.js'],
        options: {
          globals: {
            jQuery: true
          },
          esversion: 6
        }
      }
    },
    sass: {
      task: {
        options: {
          unixNewlines: true,
          style: 'expanded',
          precision: 6,
          noCache: true
        },
        files: [{
          expand: true,
          cwd: 'src/sass/',
          src: ['**/*.scss'],
          dest: 'dist/css/',
          ext: '.css'
        }]
      }
    },
    babel: {
      //options: {
      //  presets: ['env']
      //},
      dev: {
        files: {
          'dist/js/datemagic.js': 'src/js/datemagic.js'
        },
        options: {
          sourceMap: true,
        }
      },
      dist: {
        options: {
          minified: true,
          comments: false,
        },
        files: {
          'dist/js/datemagic.min.js': 'dist/js/datemagic.js'
        }
      }
    },
    watch: {
      jshint: {
        files: ['<%= jshint.dev.src %>'],
        tasks: ['jshint','babel']
      },
      sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['jshint:dev', 'babel:dev', 'sass']);
  grunt.registerTask('dist', ['babel:dist', 'sass']);
};
