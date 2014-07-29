module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.file.readJSON('package.json')

  License = '/*!Copyright(c) CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */'

  CSS = [
    'src/css/base.css',
    'src/css/fontalias.css'
  ]

  SRC_CORE = [
    'src/CommentFilter.js'
    'src/CommentSpaceAllocator.js'
    'src/CommentCoreLibrary.js'
  ]

  SRC_SCRIPTING_KAGEROU =
    display: 'src/scripting/api/Display/Display.ts'
    runtime: 'src/scripting/api/Runtime/Runtime.ts'
    player:  'src/scripting/api/Player/Player.ts'
    utils:   'src/scripting/api/Utils/Utils.ts'
    tween:   'src/scripting/api/Tween/Tween.ts'

  SRC_PARSER = [
    'src/parsers/AcfunFormat.js'
    'src/parsers/BilibiliFormat.js'
  ]
  
  # Dynamically generate the ts targets
  kagerou_config = { }
  for target,src of SRC_SCRIPTING_KAGEROU
    kagerou_config['kagerou_engine_' + target] = 
      options: 
        target: 'es5'
        basePath: src.split('/')[0..-1].join('/')
      src: src
      dest: 'build/scripting/api/' + src.split('/').pop().split('.')[0] + '.js'
  
  # Core concatenated with libraries
  # Actual concat ordering does not/should not matter
  SRC_CORELIB = SRC_CORE.concat(SRC_PARSER)

  grunt.initConfig(
    clean:
      scripting: ['build/scripting']
      build: ['build']
    
    # Concat CSS and JS files
    # core_only : builds CCL without parsers
    # all       : builds CCL with everything
    concat:
      scripting:
        files:
          'build/scripting/Host.js': ['src/scripting/Host.js','src/scripting/Unpacker.js']
      core_only:
        files:
          'build/style.css':       CSS
          'build/CommentCore.js':  SRC_CORE
      all:
        files:
          'build/style.css':             CSS
          'build/CommentCoreLibrary.js': SRC_CORELIB
    
    # Compile TypeScript
    typescript: kagerou_config
    
    # Copy
    copy:
      scripting:
        files:[
          {expand: true, cwd:'src/scripting/api/', src: ['*.js'],  dest:'build/scripting/api/'},
          {expand: true, cwd:'src/scripting/', src: ['OOAPI.js','Worker.js'],  dest:'build/scripting/'}
        ]
    
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
  grunt.registerTask 'build-scripting', ['clean:scripting','concat:scripting', 'copy:scripting', 'typescript']
  grunt.registerTask 'build-core', ['concat:core_only', 'autoprefixer', 'cssmin', 'uglify:core_only']
  grunt.registerTask 'build', ['concat:all', 'autoprefixer', 'cssmin', 'uglify:all']
  grunt.registerTask 'default', ['clean', 'build', 'watch']

