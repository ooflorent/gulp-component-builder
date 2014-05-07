var Build = require('component-builder');

var umd = Build.scripts.umd;
var canonical = Build.scripts.canonical;
var requirejs = Build.scripts.require;

module.exports = function(plugins) {
  var self = this;
  var tree = this.tree;
  var opts = this.options;

  var require = opts.require != null ? opts.require : true;
  var autorequire = opts.autorequire !== false;

  return function(done) {
    var build = Build.scripts(tree, opts);

    if (plugins) {
      plugins.call(null, build, opts);
    } else {
      build
        .use('scripts', Build.plugins.js(opts))
        .use('json', Build.plugins.json(opts))
        .use('templates', Build.plugins.string(opts));
    }

    build.end(function(err, js) {
      if (err) return done(err);
      if (!js) return done(null);

      if (require) js = requirejs + js;
      if (autorequire) js += 'require("' + canonical(tree).canonical + '")\n';

      done(null, self.file(opts.name + '.js', js));
    });
  };
};
