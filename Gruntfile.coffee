module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.file.readJSON('package.json')

  License = '/*!Copyright(c) CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */'

  SRC_CORE = [
    'src/CommentFilter.js'
    'src/CommentSpaceAllocator.js'
    'src/CommentCoreLibrary.js'
  ]

  SRC_TRANSITION = [
    'src/CCLComment.js'
    'src/CommentFilter.js'
    'src/CommentTransitionSpaceAllocator.js'
    'src/CommentTransitionLibrary.js'
  ]

  SRC_PARSER = [
    'src/parsers/AcfunFormat.js'
    'src/parsers/BilibiliFormat.js'
  ]

  SRC_CORELIB = SRC_PARSER.concat(SRC_CORE)

  grunt.initConfig(
    # Concat CSS and JS files
    concat:
      basic_and_extras:
        files:
          'build/style.css': ['src/base.css', 'src/fontalias.css']
          'build/CommentCore.js':        SRC_CORE
          'build/CommentCoreLibrary.js': SRC_CORELIB

    # Auto-prefix CSS properties using Can I Use?
    autoprefixer:
      options:
        browsers: ['last 3 versions', 'bb 10', 'android 3']

      no_dest:
        # File to output
        src: 'build/style.css'

    # Minify CSS
    cssmin:
      minify:
        src: ['build/style.css']
        dest: 'build/style.min.css'

    uglify:
      options: banner: License
      comment_core:
        files:
          'build/CommentCore.min.js': SRC_CORE
      comment_core_lib:
        files:
          'build/CommentCoreLibrary.min.js': SRC_CORELIB

    # Watch files for changes
    watch:
      css:
        files: ['src/**/*', '!node_modules']

        # Run concat, autoprefixer, cssmin and uglify
        tasks: ['build']
  )

  # Register our tasks
  grunt.registerTask 'build', ['concat', 'autoprefixer', 'cssmin', 'uglify']
  grunt.registerTask 'default', ['build', 'watch']

