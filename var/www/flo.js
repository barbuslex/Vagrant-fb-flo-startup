var flo = require('fb-flo'),
    path = require('path'),
    fs = require('fs');

var server = flo(
  './',
  {
    port: 8888,
    host: 'local.dev',
    verbose: true,
    glob: [
      '**/*.js',
      '**/*.css',
	  '**/*.html'
    ]
  },
  function resolver(filepath, callback) {
    callback({
      resourceURL: filepath,
	  reload: !filepath.match(/\.(css|js)$/),
      contents: fs.readFileSync(filepath),
      update: function(_window, _resourceURL) {
        console.log("Resource " + _resourceURL + " has just been updated with new content");
      }
    });
  }
);