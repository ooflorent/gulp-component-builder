var Build = require('component-builder');

module.exports = function(plugins) {
  var self = this;
  var tree = this.tree;
  var opts = this.options;

  return function(done) {
    var build = Build.styles(tree, opts)
      .use('styles', Build.plugins.css(opts));

    if (plugins) {
      plugins.call(null, build, opts);
    }

    build.end(function(err, css) {
      if (err) return done(err);
      if (!css) return done(null);
      done(null, self.file(opts.name + '.css', css));
    });
  };
};
