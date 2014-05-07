var async = require('async');
var through = require('through2');
var resolve = require('component-resolver');
var PluginError = require('gulp-util').PluginError;
var Build = require('component-builder');
var Builder = require('./builder');

function noop(done) {
  done();
}

function parse(args, builder) {
  args = [].slice.call(args);

  var opts;
  var fn;

  if (args.length === 1) {
    if (typeof args[0] === 'function') {
      opts = {};
      fn = args[0];
    } else {
      opts = args[0];
    }
  } else if (args.length > 1) {
    opts = args[0];
    fn = args[1];
  }

  if (!opts) opts = {};

  if (builder) {
    opts.builds = {};
    opts.builds[builder] = true;

    if (fn) {
      opts.plugins = {};
      opts.plugins[builder] = fn;
    }
  }

  return opts;
}

function component(options) {
  options.name = options.name || 'build';
  options.plugins = options.plugins || {};
  options.builds = options.builds || {
    scripts: true,
    styles: true,
    files: true
  };

  return through.obj(function(file, enc, callback) {
    var stream = this;

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-component-builder', 'Streaming not supported'));
      return callback();
    }

    options.cwd = file.cwd;
    options.base = file.base;

    resolve(options.base, {}, function(err, tree) {
      if (err) {
        stream.emit('error', new PluginError('gulp-component-builder', err));
        return callback();
      }

      var build = new Builder(tree, options);
      async.parallel([
        options.builds.scripts ? build.scripts(options.plugins.scripts) : noop,
        options.builds.styles ? build.styles(options.plugins.styles) : noop,
        options.builds.files ? build.files(options.plugins.files) : noop
      ], function(err, files) {
        if (err) {
          stream.emit('error', new PluginError('gulp-component-builder', err));
        } else {
          files.forEach(function(file) {
            if (file) stream.push(file);
          });
        }

        callback();
      });
    });
  });
};

[
  'scripts',
  'styles',
  'files'
].forEach(function(builder) {
  component[builder] = function() {
    return component(parse(arguments, builder));
  };
});

component.plugins = Build.plugins;

module.exports = component;
