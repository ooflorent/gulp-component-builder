# gulp-component-builder

> [component](http://component.io) build plugin for [gulp](https://github.com/gulpjs/gulp)

__Disclaimer:__ This plugin is under active development.

## Installation

```bash
$ npm install --save-dev gulp-component-builder
```

## Usage

```js
var gulp = require('gulp');
var component = require('gulp-component-builder');
var stylus = require('component-stylus-plugin');

gulp.task('scripts', function() {
  return gulp.src('component.json')
    .pipe(component.scripts())
    .pipe(gulp.dest('build'));
});

gulp.task('styles', function() {
  return gulp.src('component.json')
    .pipe(component.styles(function(builder) {
      builder.use(stylus)
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch(['component.json', 'lib/**/*.js'], ['scripts'])
  gulp.watch(['component.json', 'lib/**/*.styl'], ['styles'])
});

gulp.task('default', ['scripts', 'styles']);
```

## API

- `component([options])`
- `component.scripts([options], [configure])`
- `component.styles([options], [configure])`
- `component.files([options], [configure])`

## License

MIT
