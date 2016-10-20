module.exports = (grunt) ->
  require('load-grunt-tasks') grunt , {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  }
  grunt.file.readJSON('package.json')

  # !! Compile configurations
  LICENSE = '/*!Copyright(c) CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */'
  # !! End of config area

  CSS = [
    'src/css/base.css',
    'src/css/fontalias.css'
  ]

  SRC_CORE = [
    'src/Array.js'
    'src/core/CommentSpaceAllocator.js'
    'src/core/Comment.js'
    'src/CommentManager.js'
  ]
  
  SRC_MODULES = 
    'filter': ['src/filter/SimpleFilter.js']
    'provider': ['src/CommentProvider.js']
    'format-bilibili': ['src/parsers/BilibiliFormat.js']
    'format-acfun': ['src/parsers/AcfunFormat.js']
    'format-common': ['src/parsers/CommonDanmakuFormat.js']

  # Typescript targets
  SRC_TS_CORE = [
    'Comment'
    'CommentSpaceAllocator'
  ]

  SRC_TS_SCRIPTING_KAGEROU =
    'display': 'src/scripting/api/Display/Display.ts'
    'runtime': 'src/scripting/api/Runtime/Runtime.ts'
    'player': 'src/scripting/api/Player/Player.ts'
    'utils': 'src/scripting/api/Utils/Utils.ts'
    'tween': 'src/scripting/api/Tween/Tween.ts'

  # ==== Below this point is logic to generate compile configurations ====
  # You probably do not need to edit anything below here

  # Dynamically generate the target for all
  CMP_ALL = []
  CMP_ALL = CMP_ALL.concat SRC_CORE
  for name, source of SRC_MODULES
    CMP_ALL = CMP_ALL.concat source

  # Dynamically generate the core ts targets
  CMP_CORE_TS = {}
  CMP_CORE_NAME = []
  for target in SRC_TS_CORE
    CMP_CORE_NAME.push ("ts:core_" + target)
    CMP_CORE_TS["core_" + target] =
      src: ["src/core/" + target + ".ts"]
      out: "src/core/" + target + ".js"

  # Dynamically generate the kagerou ts targets
  CMP_KAGEROU_TS = {}
  CMP_KAGEROU_NAME = []
  for target,src of SRC_TS_SCRIPTING_KAGEROU
    CMP_KAGEROU_NAME.push ('ts:kagerou_engine_' + target)
    CMP_KAGEROU_TS['kagerou_engine_' + target] =
      src: src
      out: 'dist/scripting/api/' + src.split('/').pop().split('.')[0] + '.js'

  # Append Typescript Tasks
  ts_config = 
    options:
      target: 'es5'
  for key,value of CMP_CORE_TS
    ts_config[key] = value
  for key,value of CMP_KAGEROU_TS
    ts_config[key] = value

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.initConfig(
    clean:
      scripting: ['dist/scripting']
      dist: ['dist']

    # Concat CSS and JS files
    # dist_core : builds CCL with just the comment system
    # dist_all : builds CCL with everything
    # scripting_host : builds just the scripting host
    concat:
      dist_core:
        files:
          'dist/css/style.css': CSS
          'dist/CommentCoreLibrary.js': SRC_CORE
      dist_all:
        files:
          'dist/css/style.css': CSS
          'dist/CommentCoreLibrary.js': CMP_ALL
      scripting_host:
        files:
          'dist/scripting/Host.js': ['src/scripting/Host.js','src/scripting/Unpacker.js']

    # Compile TypeScript
    ts: ts_config

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
        tasks: ['build-scripting']
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

    # Jasmine test
    jasmine:
      coverage:
        src: 'src/**/*.js'
        options:
          specs: 'compiled_spec/*spec.js'
          helpers: 'spec/*helper.js'
          vendor: [
            'node_modules/jquery/dist/jquery.js'
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
            'node_modules/sinon/pkg/sinon.js'
            'node_modules/jasmine-sinon/lib/jasmine-sinon.js'
            'node_modules/promise-polyfill/promise.js' # TODO: remove when phantomjs supports promises
          ]
          template: require('grunt-template-jasmine-istanbul')
          templateOptions:
            report: 'coverage'
            coverage: 'coverage/coverage.json'
      ci:
        src: 'dist/CommentCoreLibrary.js'
        options:
          specs: 'compiled_spec/*spec.js'
          helpers: 'spec/*helper.js'
          vendor: [
            'node_modules/jquery/dist/jquery.js'
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
            'node_modules/sinon/pkg/sinon.js'
            'node_modules/jasmine-sinon/lib/jasmine-sinon.js'
            'node_modules/promise-polyfill/promise.js' # TODO: remove when phantomjs supports promises
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
  grunt.registerTask 'compile:ts-core', CMP_CORE_NAME
  grunt.registerTask 'compile:ts-kagerou', CMP_KAGEROU_NAME

  # Register our tasks
  grunt.registerTask 'test', ['coffee', 'jasmine:coverage']
  grunt.registerTask 'build', ['compile:ts-core', 'concat:dist_all', 'autoprefixer', 'cssmin', 'uglify:all']
  grunt.registerTask 'build:core', ['compile:ts-core', 'concat:dist_core', 'autoprefixer', 'cssmin', 'uglify:core']
  grunt.registerTask 'build:scripting', ['clean:scripting','concat:scripting_host', 'compile:ts-kagerou', 'copy:scripting_sandbox']
  grunt.registerTask 'ci', ['build', 'coffee', 'jasmine:ci']

  grunt.registerTask 'default', ['clean', 'build', 'build:scripting', 'watch']
