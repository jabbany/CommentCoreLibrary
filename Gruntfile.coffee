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

  # Dynamically generate the target for all
  CMP_ALL = []
  CMP_ALL = CMP_ALL.concat SRC_CORE
  for name, source of SRC_MODULES
    CMP_ALL = CMP_ALL.concat source

  # Generate the core ts targets
  CMP_CORE_TS =
    'core':
      src: SRC_TS_CORE
      outDir: 'compiled_src/'
  CMP_CORE_NAME = ['ts:core']

  # Dynamically generate the kagerou ts targets
  CMP_KAGEROU_TS = {}
  CMP_KAGEROU_NAME = []
  for target, src of SRC_TS_SCRIPTING_KAGEROU
    CMP_KAGEROU_NAME.push ('ts:kagerou_engine_' + target.toLowerCase())
    CMP_KAGEROU_TS['kagerou_engine_' + target.toLowerCase()] =
      src: src
      out: 'dist/scripting/api/' + target + '.js'

  # Append Typescript Tasks
  ts_config =
    options:
      target: 'es5'
      sourceMap: false
      rootDir: 'src/'
  for key,value of CMP_CORE_TS
    ts_config[key] = value
  for key,value of CMP_KAGEROU_TS
    ts_config[key] = value

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

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

    # Jasmine test
    jasmine:
      coverage:
        src: ['src/**/*.js', 'compiled_src/**/*.js']
        options:
          specs: ['compiled_spec/*_spec.js']
          helpers: ['compiled_spec/*_helper.js']
          vendor: [
            'node_modules/jquery/dist/jquery.js'
            'node_modules/sinon/pkg/sinon.js'
            'node_modules/jasmine-sinon/lib/jasmine-sinon.js'
          ]
          # Don't use this, it doesnt work anymore
          #template: require('grunt-template-jasmine-istanbul')
          #templateOptions:
          #  report: 'coverage'
          #  coverage: 'coverage/coverage.json'
      ci:
        src: ['dist/CommentCoreLibrary.js']
        options:
          specs: ['compiled_spec/*_spec.js']
          helpers: ['compiled_spec/*_helper.js']
          vendor: [
            'node_modules/jquery/dist/jquery.js'
            'node_modules/sinon/pkg/sinon.js'
            'node_modules/jasmine-sinon/lib/jasmine-sinon.js'
          ]
          # Don't use this, it doesnt work anymore
          #template: require('grunt-template-jasmine-istanbul')
          #templateOptions:
          #  report:
          #    type: 'lcovonly'
          #    options:
          #      dir:  'coverage'
          #  coverage: 'coverage/coverage.json'

    coffee:
      glob_to_multiple:
        expand:  true,
        flatten: true,
        src: ['spec/**/*.coffee']
        dest: 'compiled_spec/'
        ext: '.js'
  )

  grunt.loadNpmTasks("grunt-ts");
  # Register our tasks
  grunt.registerTask 'build', ['clean', 'ts']

  grunt.registerTask 'ci', ['build', 'coffee', 'jasmine:ci']
  grunt.registerTask 'test', ['coffee', 'jasmine:coverage']

  grunt.registerTask 'default', ['clean', 'build']
