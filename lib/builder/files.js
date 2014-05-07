var Build = require('component-builder');

module.exports = function(plugins) {
  var tree = this.tree;
  var opts = this.options;

  return function(done) {
    var build = Build.files(tree, opts);

    if (plugins) {
      plugins.call(null, build, opts);
    } else {
      var plugin = Build.plugin.copy(opts);
      build
        .use('images', plugin)
        .use('fonts', plugin)
        .use('files', plugin);
    }

    build.end(function(err, contents) {
      done();
    });
  };
};
