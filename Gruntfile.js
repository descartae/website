module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        presets: ['env']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'js',
            src: ['**/*.js'],
            dest: 'dist/js'
          }
        ]
      }
    },
    cssmin: {
      minify: {
        expand: true,
        src: ['css/*.css', '!css/*.min.css'],
        dest: 'dist/',
        ext: '.css'
      }
    },
    processhtml: {
      dist: {
        options: {
          process: true
        },
        files: {
          'dist/index.min.html': ['index.html'],
          'dist/facility.min.html': ['facility.html']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'dist/index.min.html',
          'dist/facility.html': 'dist/facility.min.html'
        }
      }
    },
    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: 'img',
            src: '**/*.{png,jpg,svg,ico}',
            dest: 'dist/img'
          },
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: 'mobile-assets',
            src: ['**/*.png'],
            dest: 'dist/assets'
          },
        ]
      },
      misc: {
        expand: true,
        src: [
          'googlef53629e00736ad78.html',
          '.well-known/**'
        ],
        dest: 'dist/.',
      }
    },

    clean: ['dist*//*.min.*'],

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 1234,
        }
      }
    },

    watch: {
      config: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      html: {
        files: ['index.html', 'facility.html'],
        tasks: ['babel'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: 'js/**/*.js',
        tasks: ['babel'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: 'css/**/*.css',
        tasks: ['cssmin'],
        options: {
          livereload: true,
        },
      },
      img: {
        files: 'img/**/*.{png,jpg,svg,ico}',
        tasks: ['copy:images'],
        options: {
          livereload: true,
        },
      },
    },
  })

  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-processhtml')
  grunt.registerTask('default', ['build', 'connect', 'watch'])
  grunt.registerTask('build', ['babel', 'cssmin', 'processhtml', 'htmlmin', 'copy:images', 'copy:assets', 'copy:misc', 'clean'])
}
