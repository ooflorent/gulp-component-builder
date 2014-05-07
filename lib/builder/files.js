var Build = require('component-builder');

module.exports = function(plugins) {
  var tree = this.tree;
  var opts = this.options;

  return function(done) {
    var plugin = Build.plugin.copy(opts);
    var build = Build.files(tree, opts)
      .use('images', plugin)
      .use('fonts', plugin)
      .use('files', plugin);

    if (plugins) {
      plugins.call(null, build, opts);
    }

    build.end(function(err, contents) {
      done();
    });
  };
};
