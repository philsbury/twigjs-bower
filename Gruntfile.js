module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    exec: {
      update: "cd ./twig.js/ git pull origin master && cd ../",
      build: "cd ./twig.js/ && npm run build && cd ../"
    },
    copy: {
      main: {
        files: [
          {
            cwd: 'twig.js/',
            src: 'twig.*',
            dest: 'twig/',
            expand: true
          }
        ]
      }
    },
    gittag: {
      version: {
        options: {
          tag: '<%= pkg.version %>'
        }
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', function() {
    var twig = grunt.file.readJSON('twig.js/package.json');

    

    if(pkg.version !== twig.version){
      pkg.version = twig.version;
      var fs = require("fs"); 
      var json = JSON.stringify(pkg, null, 2); 
      fs.writeFileSync("package.json",json);

      grunt.config('pkg', twig.version);
      
      grunt.task.run('gittag');
    }

  });

  // Default task(s).
  grunt.registerTask('default', ['exec:update', 'exec:build', 'copy', 'test']);

};