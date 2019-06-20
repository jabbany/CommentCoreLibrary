module.exports = (grunt) ->
  require('load-grunt-tasks') grunt , {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  }
  # Read package.json to make sure it's there
  pkg = grunt.file.readJSON('package.json')

  # !! Compile configurations
  LICENSE = '/*!Copyright(c) CommentCoreLibrary v' + pkg.version +
    ' (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */'
  # !! End of config area

  CSS = [
    'src/css/base.css',
    'src/css/fontalias.css'
  ]

  # ==== Below this point is logic to generate compile configurations ====
  # You probably do not need to edit anything below here
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.initConfig(
    clean:
      temp: [
        'compiled_spec/',
        'compiled_src/'
      ]
      dist: [
        'dist'
      ]

    # Compile TypeScript
    ts: {
      default: {
        tsconfig: './tsconfig.json'
      }
    }

    # Copy
    copy:
      scripting_sandbox:
        files:[
          {expand: true, cwd:'src/scripting/api/', src: ['*.js'],  dest:'dist/scripting/api/'},
          {expand: true, cwd:'src/scripting/', src: ['OOAPI.js','Worker.js'],  dest:'dist/scripting/'}
        ]

    # Auto-prefix CSS properties using Can I Use?
    autoprefixer:
      options:
        browsers: ['last 3 versions', 'bb 10', 'android 3']
      no_dest:
        # File to output
        src: 'dist/css/style.css'

    # Minify CSS
    cssmin:
      minify:
        src: ['dist/css/style.css']
        dest: 'dist/css/style.min.css'

    # Minify JS
    uglify:
      options:
        banner: LICENSE
      all:
        files:
          'dist/CommentCoreLibrary.min.js': ['dist/CommentCoreLibrary.js']

    # Watch files for changes
    watch:
      scripting:
        files: ['src/scripting/**/*', '!node_modules']
        tasks: ['build:scripting']
      core:
        files: ['src/**/*', '!node_modules', '!src/scripting/**/*']
        tasks: ['build']

    # JSHint
    jshint:
      options:
        curly:   true,
        eqeqeq:  true,
        immed:   true,
        latedef: true,
        newcap:  true,
        noarg:   true,
        sub:     true,
        undef:   true,
        boss:    true,
        eqnull:  true,
        node:    true,
        strict:  false,
        mocha:   true
      all:
        src: ['src/*.js']

    coffee:
      glob_to_multiple:
        expand:  true,
        flatten: true,
        src: ['spec/**/*.coffee']
        dest: 'compiled_spec/'
        ext: '.js'
  )


  # Register our tasks
  grunt.registerTask 'build', ['clean', 'ts']

  grunt.registerTask 'test', ['build'] # And do tests
  grunt.registerTask 'ci', ['build'] # Do CI stuff

  grunt.registerTask 'default', ['build', 'watch']
