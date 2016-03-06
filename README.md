Gulp Pragma
===========
A Gulp plugin to optionally remove pragma comments from your code that follow a particular pattern. Useful for JavaScript builds.
### Installation &nbsp;  [![npm version](https://badge.fury.io/js/gulp-pragma.svg)](http://badge.fury.io/js/gulp-pragma) [![NPM downloads](https://img.shields.io/npm/dm/gulp-pragma.svg)](https://npmjs.org/package/gulp-pragma "View this project on NPM")
```sh
npm install gulp-pragma
```
### Simple Usage
Pass a simple config object to `pragma()` in your Gulp pipe. All the properties of the objects represent pragma tags. Set to false to remove them. Use `all` if you want to just remove all pragma blocks.

The system will look for sections of code that have this signature:
```javascript
// To remove this section use: pragma({ debug: false })
/* pragma:DEBUG_START */
var a = true;
console.warn("a is", a);
/* pragma:DEBUG_END */

// To remove this section use: pragma({ amd: false })
/* pragma:AMD_START */
var a = true;
console.warn("a is", a);
/* pragma:AMD_END */
```
Use in your gulpfile:
```javascript
var pragma = require('gulp-pragma');
gulp.src(['/**/*.js'])
.pipe(pragma({
    debug: false,
    amd: false
  }));
```
To remove all pragma blocks:
```javascript
gulp.src(['/**/*.js'])
.pipe(pragma({
    all: false
  }));
```
Note: Its recommended you run this on your concatenated stream rather than your split-up file stream for performance reasons.