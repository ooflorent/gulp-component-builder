var path = require('path');
var File = require('gulp-util').File;

function Builder(tree, options) {
  this.tree = tree;
  this.options = options;
}

Builder.prototype = {
  scripts: require('./scripts'),
  styles: require('./styles'),
  files: require('./files')
};

Builder.prototype.file = function(name, contents) {
  return new File({
    cwd: this.options.cwd,
    base: this.options.base,
    path: path.join(this.options.base, name),
    contents: new Buffer(contents)
  });
};

module.exports = Builder;
