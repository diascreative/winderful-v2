// Generated on 2016-07-27 using generator-angular-fullstack 3.5.0
'use strict';

module.exports = function(grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    buildcontrol: 'grunt-build-control',
    istanbul_check_coverage: 'grunt-mocha-istanbul',
    ngconstant: 'grunt-ng-constant'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var packageJson = require('./package.json');
  var path = require('path');
  var swPrecache = require('sw-precache');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      server: 'server',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: '<%= yeoman.server %>',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= yeoman.dist %>/<%= yeoman.server %>'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      babel: {
        files: ['<%= yeoman.client %>/{admin-app,app,components}/**/!(*.spec|*.mock).js'],
        tasks: ['newer:babel:client']
      },
      ngconstant: {
        files: ['<%= yeoman.server %>/config/environment/shared.js'],
        tasks: ['ngconstant']
      },
      injectJS: {
        files: [
          '<%= yeoman.client %>/{admin-app,app,components}/**/!(*.spec|*.mock).js',
          '!<%= yeoman.client %>/app/app.js',
          '!<%= yeoman.client %>/admin-app/admin-app.js'
        ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: ['<%= yeoman.client %>/{admin-app,app,components}/**/*.css'],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['<%= yeoman.server %>/**/*.{spec,integration}.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: ['<%= yeoman.client %>/{admin-app,app,components}/**/*.{spec,mock}.js'],
        tasks: ['newer:jshint:all', 'wiredep:test', 'karma']
      },
      injectStylus: {
        files: ['<%= yeoman.client %>/{admin-app,app,components}/**/*.styl'],
        tasks: ['injector:stylus']
      },
      stylus: {
        files: ['<%= yeoman.client %>/{admin-app,app,components}/**/*.styl'],
        tasks: ['stylus', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/{admin-app,app,components}/**/*.{css,html}',
          '{.tmp,<%= yeoman.client %>}/{admin-app,app,components}/**/!(*.spec|*.mock).js',
          '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['<%= yeoman.server %>/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: '<%= yeoman.server %>/.jshintrc'
        },
        src: ['<%= yeoman.server %>/**/!(*.spec|*.integration).js']
      },
      serverTest: {
        options: {
          jshintrc: '<%= yeoman.server %>/.jshintrc-spec'
        },
        src: ['<%= yeoman.server %>/**/*.{spec,integration}.js']
      },
      all: ['<%= yeoman.client %>/{admin-app,app,components}/**/!(*.spec|*.mock|app.constant).js'],
      test: {
        src: ['<%= yeoman.client %>/{admin-app,app,components}/**/*.{spec,mock}.js']
      }
    },

    jscs: {
      options: {
        config: ".jscsrc"
      },
      main: {
        files: {
          src: [
            '<%= yeoman.client %>/app/**/*.js',
            '<%= yeoman.server %>/**/*.js'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/!(.git*|.openshift|Procfile)**'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: ['last 4 version']})
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: '<%= yeoman.server %>',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function() {
              setTimeout(function() {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app and karma.conf.js
    wiredep: {
      options: {
        exclude: [
          'angular-cookies',
          'angular-file-upload',
          'angular-ui-notification',
          '/angular-ui-select/dist/select.css',
          /bootstrap/,
          '/es5-shim/',
          /font-awesome\.css/,
          '/json3/'
        ]
      },
      client: {
        src: '<%= yeoman.client %>/index.html',
        ignorePath: '<%= yeoman.client %>/',
      },
      clientAdmin: {
        options: {
          exclude: [
          'angular-leaflet-directive',
          '/es5-shim/',
          '/json3/'
          ]
        },
        src: '<%= yeoman.client %>/admin.html',
        ignorePath: '<%= yeoman.client %>/',
      },
      test: {
        src: './karma.conf.js',
        devDependencies: true
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/<%= yeoman.client %>/!(bower_components){,*/}*.{js,css}',
          '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '!<%= yeoman.dist %>/<%= yeoman.client %>/assets/images/{,*/}screenshot.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.client %>/{index,admin}.html'],
      options: {
        dest: '<%= yeoman.dist %>/<%= yeoman.client %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/<%= yeoman.client %>/{,!(bower_components)/**/}*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.client %>/!(bower_components){,*/}*.css'],
      js: ['<%= yeoman.dist %>/<%= yeoman.client %>/!(bower_components){,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/<%= yeoman.client %>',
          '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          css: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images']
          ],
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Dynamically generate angular constant `appConfig` from
    // `server/config/environment/shared.js`
    ngconstant: {
      options: {
        name: 'winderfulApp.constants',
        dest: '<%= yeoman.client %>/app/app.constant--shared.js',
        deps: [],
        wrap: true,
        configPath: '<%= yeoman.server %>/config/environment/shared'
      },
      app: {
        constants: function() {
          return {
            appConfig: require('./' + grunt.config.get('ngconstant.options.configPath'))
          };
        }
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      main: {
        options: {
          // This should be the name of your apps angular module
          module: 'winderfulApp',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          usemin: 'app/app.js'
        },
        cwd: '<%= yeoman.client %>',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      clientAdmin: {
        options: {
          // This should be the name of your apps angular module
          prefix: 'admin-app',
          module: 'winderfulAppAdmin',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          usemin: 'admin-app/admin-app.js'
        },
        cwd: '<%= yeoman.client %>/admin-app',
        src: ['**/*.html'],
        dest: '.tmp/admin-templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/<%= yeoman.client %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'assets/json/**/*',
            'admin.html',
            'index.html',
            'service-worker-registration.js'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            '<%= yeoman.server %>/**/*',
            '!<%= yeoman.server %>/config/local.env.sample.js'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '.tmp/',
        src: ['{admin-app,app,components}/**/*.css']
      }
    },

    buildcontrol: {
      options: {
        dir: '<%= yeoman.dist %>',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      pre: [
        'injector:stylus',
        'ngconstant'
      ],
      server: [
        'newer:babel:client',
        'stylus',
      ],
      test: [
        'newer:babel:client',
        'stylus',
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'newer:babel:client',
        'stylus',
        'imagemin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'mocha.conf.js',
        timeout: 5000 // set default mocha spec timeout
      },
      unit: {
        src: ['<%= yeoman.server %>/**/*.spec.js']
      },
      integration: {
        src: ['<%= yeoman.server %>/**/*.integration.js']
      }
    },

    mocha_istanbul: {
      unit: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.spec.js',
          coverageFolder: 'coverage/server/unit'
        },
        src: '<%= yeoman.server %>'
      },
      integration: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.integration.js',
          coverageFolder: 'coverage/server/integration'
        },
        src: '<%= yeoman.server %>'
      }
    },

    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage/**',
          check: {
            lines: 80,
            statements: 80,
            branches: 80,
            functions: 80
          }
        }
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles ES6 to JavaScript using Babel
    babel: {
      options: {
        sourceMap: true
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>',
          src: ['{admin-app,app,components}/**/!(*.spec).js'],
          dest: '.tmp'
        }]
      },
      server: {
        options: {
          plugins: [
            'transform-class-properties',
            'transform-runtime'
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.server %>',
          src: [
            '**/*.js',
            '!config/local.env.sample.js'
          ],
          dest: '<%= yeoman.dist %>/<%= yeoman.server %>'
        }]
      }
    },

    // Compiles Stylus to CSS
    stylus: {
      server: {
        options: {
          "include css": true
        },
        files: {
          '.tmp/app/app.css' : '<%= yeoman.client %>/app/app.styl',
          '.tmp/app/critical.css' : '<%= yeoman.client %>/app/critical.styl',
          '.tmp/admin-app/admin-app.css' : '<%= yeoman.client %>/admin-app/admin-app.styl'
        }
      }
    },

    inline: {
      dist: {
        options:{
          tag: 'critical',
          cssmin: true
        },
        src: '<%= yeoman.dist %>/<%= yeoman.client %>/index.html'
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          '<%= yeoman.dist %>/<%= yeoman.client %>/index.html': '<%= yeoman.dist %>/<%= yeoman.client %>/index.html'
        }
      }
    },

    injector: {
      options: {},
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          sort: function(a, b) {
            var module = /\.module\.(js|ts)$/;
            var aMod = module.test(a);
            var bMod = module.test(b);
            // inject *.module.js first
            return (aMod === bMod) ? 0 : (aMod ? -1 : 1);
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
               [
                 '<%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).js',
                 '!{.tmp,<%= yeoman.client %>}/app/app.{js,ts}'
               ]
            ],
          '<%= yeoman.client %>/admin.html': [
               [
                 '<%= yeoman.client %>/admin-app/**/!(*.spec|*.mock).js',
                 '!{.tmp,<%= yeoman.client %>}/admin-app/admin-app.{js,ts}'
               ]
            ]
        }
      },

      // Inject component styl into app.styl
      stylus: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/app/', '');
            filePath = filePath.replace('/' + yoClient + '/components/', '../components/');
            return '@import \'' + filePath + '\';';
          },
          starttag: '/* inject:styl */',
          endtag: '/* endinject */'
        },
        files: {
          '<%= yeoman.client %>/app/app.styl': [
            '<%= yeoman.client %>/{app,components}/**/*.styl',
            '!<%= yeoman.client %>/app/app.styl',
            '!<%= yeoman.client %>/components/_variables.styl',
            '!<%= yeoman.client %>/app/critical.styl',
            '!<%= yeoman.client %>/components/critical/**/*.styl'
          ],
          '<%= yeoman.client %>/app/critical.styl': [
            '<%= yeoman.client %>/components/critical/**/*.styl'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            var yoClient = grunt.config.get('yeoman.client');
            filePath = filePath.replace('/' + yoClient + '/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app,components}/**/*.css'
          ],
          '<%= yeoman.client %>/admin.html': [
            '<%= yeoman.client %>/admin-app/**/*.css'
          ]
        }
      }
    },
    realFavicon: {
      favicons: {
        src: '<%= yeoman.client %>/assets/images/favicon.png',
        dest: '<%= yeoman.dist %>/<%= yeoman.client %>',
        options: {
        iconsPath: '/',
        html: ['<%= yeoman.dist %>/<%= yeoman.client %>/favicons.html'],
        design: {
          ios: {
          pictureAspect: 'backgroundAndMargin',
          backgroundColor: '#ffffff',
          margin: '25%',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true
          }
          },
          desktopBrowser: {},
          windows: {
          pictureAspect: 'whiteSilhouette',
          backgroundColor: '#005a6b',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
            }
          }
          },
          androidChrome: {
          pictureAspect: 'shadow',
          themeColor: '#005a6b',
          manifest: {
            name: 'Winderful',
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false
          }
          },
          safariPinnedTab: {
          pictureAspect: 'blackAndWhite',
          threshold: 82.03125,
          themeColor: '#005a6b'
          }
        },
        settings: {
          scalingAlgorithm: 'Mitchell',
          errorOnImageTooSmall: false
        }
        }
      }
    },
    swPrecache: {
      dev: {
        handleFetch: false,
        rootDir: '<%= yeoman.client %>'
      },
      prod: {
        handleFetch: true,
        rootDir: '<%= yeoman.dist %>/<%= yeoman.client %>'
      }
    }
  });

  function writeServiceWorkerFile(rootDir, handleFetch, callback) {
    var config = {
      cacheId: packageJson.name,
      // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
      // the service worker will precache resources but won't actually serve them.
      // This allows you to test precaching behavior without worry about the cache preventing your
      // local changes from being picked up during the development cycle.
      handleFetch: handleFetch,
      logger: grunt.log.writeln,
      staticFileGlobs: [
        rootDir + '/app/**.css',
        rootDir + '/index.html',
        rootDir + '/assets/images/**.*',
        rootDir + '/assets/images/landscapes/**.*'
      ],
      stripPrefix: rootDir + '/',
      // verbose defaults to false, but for the purposes of this demo, log more.
      verbose: true
    };

    swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
  }

  grunt.registerMultiTask('swPrecache', function() {
    var done = this.async();
    var rootDir = this.data.rootDir;
    var handleFetch = this.data.handleFetch;

    writeServiceWorkerFile(rootDir, handleFetch, function(error) {
      if (error) {
        grunt.fail.warn(error);
      }
      done();
    });
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function() {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist-no-build') {
      return grunt.task.run(['env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:pre',
        'concurrent:server',
        'injector',
        'wiredep:client',
        'wiredep:clientAdmin',
        'postcss',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'concurrent:pre',
      'concurrent:server',
      'injector',
      'wiredep:client',
      'wiredep:clientAdmin',
      'swPrecache:dev',
      'postcss',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target, option) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest:unit',
        'mochaTest:integration'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:pre',
        'concurrent:test',
        'injector',
        'postcss',
        'wiredep:test',
        'karma'
      ]);
    }

    else if (target === 'e2e') {

      if (option === 'prod') {
        return grunt.task.run([
          'build',
          'env:all',
          'env:prod',
          'express:prod',
          'protractor'
        ]);
      }

      else {
        return grunt.task.run([
          'clean:server',
          'env:all',
          'env:test',
          'concurrent:pre',
          'concurrent:test',
          'injector',
          'wiredep:client',
          'wiredep:clientAdmin',
          'postcss',
          'express:dev',
          'protractor'
        ]);
      }
    }

    else if (target === 'coverage') {

      if (option === 'unit') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:unit'
        ]);
      }

      else if (option === 'integration') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:integration'
        ]);
      }

      else if (option === 'check') {
        return grunt.task.run([
          'istanbul_check_coverage'
        ]);
      }

      else {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul',
          'istanbul_check_coverage'
        ]);
      }

    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:pre',
    'concurrent:dist',
    'realFavicon',
    'injector',
    'wiredep:client',
    'wiredep:clientAdmin',
    'useminPrepare',
    'postcss',
    'ngtemplates:main',
    'ngtemplates:clientAdmin',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'babel:server',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'inline',
    'htmlmin',
    'swPrecache:prod'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
