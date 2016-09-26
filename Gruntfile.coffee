module.exports = (grunt) ->
  require('load-grunt-tasks') grunt , {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  }
  grunt.file.readJSON('package.json')

  # !! Compile configurations
  License = '/*!Copyright(c) CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */'
  FilterType = "Simple" # "Comment" || "Simple"
  # !! End of config area

  CSS = [
    'src/css/base.css',
    'src/css/fontalias.css'
  ]

  SRC_CORE_CMP = [
    'Comment'
    'CommentSpaceAllocator'
  ]

  SRC_CORE = [
    'src/Array.js'
    'src/core/CommentSpaceAllocator.js'
    'src/core/Comment.js'
    'src/filter/' + FilterType + 'Filter.js'
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

  # !! Below are compile settings
  # Dynamically generate the core ts targets
  CMP_CORE_TS = { }
  CMP_CORE_NAME = [ ]
  for target in SRC_CORE_CMP
    CMP_CORE_NAME.push ("ts:" + target)
    CMP_CORE_TS[target] =
      src: ["src/core/" + target + ".ts"]
      out: "src/core/" + target + ".js"

  # Dynamically generate the kagerou ts targets
  CMP_KAGEROU_TS = { }
  CMP_KAGEROU_NAME = [ ]
  for target,src of SRC_SCRIPTING_KAGEROU
    CMP_KAGEROU_NAME.push ('ts:kagerou_engine_' + target)
    CMP_KAGEROU_TS['kagerou_engine_' + target] =
      src: src
      out: 'build/scripting/api/' + src.split('/').pop().split('.')[0] + '.js'

  # Append Typescript Tasks
  ts_config = 
    options:
      target: 'es5'
  for key,value of CMP_CORE_TS
    ts_config[key] = value
  for key,value of CMP_KAGEROU_TS
    ts_config[key] = value

  # Core concatenated with libraries
  # Actual concat ordering does not/should not matter
  SRC_CORELIB = SRC_CORE.concat(SRC_PARSER)

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  grunt.initConfig(
    clean:
      scripting: ['build/scripting']
      build: ['build']

    # Concat CSS and JS files
    # core_only : builds CCL without parsers
    # all       : builds CCL with everything
    concat:
      scripting_host:
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
    ts: ts_config

    # Copy
    copy:
      scripting_sandbox:
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
    #
    watch:
      all:
        files: ['src/**/*', '!node_modules']

        # Run concat, autoprefixer, cssmin and uglify
        tasks: ['build']

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

    # Jasmine test

    jasmine:
      coverage:
        src: 'src/**/*.js'
        options:
          specs: 'compiled_spec/*spec.js'
          helpers: 'spec/*helper.js'
          vendor: [
            'node_modules/jasmine-jquery/vendor/jquery/jquery.js'
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
          ]
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            report: 'coverage'
            coverage: 'coverage/coverage.json'
      ci:
        src: 'build/CommentCoreLibrary.js'
        options:
          specs: 'compiled_spec/*spec.js'
          helpers: 'spec/*helper.js'
          vendor: [
            'node_modules/jasmine-jquery/vendor/jquery/jquery.js'
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
          ]
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            report:
              type: 'lcovonly'
              options:
                dir:  'coverage'
            coverage: 'coverage/coverage.json'
    coffee:
      glob_to_multiple:
        expand:  true,
        flatten: true,
        src: ['spec/**/*.coffee']
        dest: 'compiled_spec/'
        ext: '.js'
  )

  # Register special compiles
  grunt.registerTask 'compile-ts-kagerou', CMP_KAGEROU_NAME
  grunt.registerTask 'compile-ts-core', CMP_CORE_NAME

  # Register our tasks
  grunt.registerTask 'test', ['coffee', 'jasmine:coverage']
  grunt.registerTask 'build-scripting', ['clean:scripting','concat:scripting_host', 'compile-ts-kagerou', 'copy:scripting_sandbox']
  grunt.registerTask 'build-core', ['compile-ts-core', 'concat:core_only', 'autoprefixer', 'cssmin', 'uglify:core_only']
  grunt.registerTask 'build', ['compile-ts-core', 'concat:all', 'autoprefixer', 'cssmin', 'uglify:all']
  grunt.registerTask 'ci', ['build', 'coffee', 'jasmine:ci']
  grunt.registerTask 'default', ['clean', 'build', 'build-scripting', 'watch']

