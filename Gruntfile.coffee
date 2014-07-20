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
  
  # Core concatenated with libraries
  # Actual concat ordering does not/should not matter
  SRC_CORELIB = SRC_CORE.concat(SRC_PARSER)

  grunt.initConfig(
    clean:
      build: ['build']
    # Concat CSS and JS files
    # core_only : builds CCL without parsers
    # all       : builds CCL with everything
    concat:
      core_only:
        files:
          'build/style.css': ['src/base.css', 'src/fontalias.css']
          'build/CommentCore.js':        SRC_CORE
      all:
        files:
          'build/style.css': ['src/base.css', 'src/fontalias.css']
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
      core_only:
        files:
          'build/CommentCore.min.js': SRC_CORE
      all:
        files:
          'build/CommentCoreLibrary.min.js': SRC_CORELIB

    # Watch files for changes
    watch:
      all:
        files: ['src/**/*', '!node_modules']

        # Run concat, autoprefixer, cssmin and uglify
        tasks: ['build']
  )

  # Register our tasks
  grunt.registerTask 'build-core', ['concat:core_only', 'autoprefixer', 'cssmin', 'uglify:core_only']
  grunt.registerTask 'build', ['concat:all', 'autoprefixer', 'cssmin', 'uglify:all']
  grunt.registerTask 'default', ['clean', 'build', 'watch']

