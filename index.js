'use strict';

var through = require('through2'),
  gutil = require('gulp-util'),
  clrs = require('colors'),
  istextorbinary = require('istextorbinary');

module.exports = function (cfg) {

  /**
   * Get an index of a specific regex
   * @param str
   * @param regex
   * @param startpos
   * @returns {Number}
   * @private
   */
  function regexIndexOf(str, regex, startpos) {
    var indexOf = str.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  }

  /**
   * Get the last index of a regex
   * @param str
   * @param regex
   * @param startpos
   * @returns {number}
   */
  function regexLastIndexOf(str, regex, startpos) {
    if (typeof (startpos) == "undefined") {
      startpos = str.length;
    } else if (startpos < 0) {
      startpos = 0;
    }
    var stringToWorkWith = str.substring(0, startpos + 1),
      lastIndexOf = -1,
      nextStop = 0,
      result;
    while ((result = regex.exec(stringToWorkWith)) != null) {
      lastIndexOf = result.index;
      regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
  }

  /**
   * Strip a particular pragma tag
   */
  function stripPragma(pragma, str) {
    if (typeof(str) === 'string' && str.indexOf('pragma') > -1) {
      var finalstr = [],
        pos = 0,
        startRegx = new RegExp("/\\*[\\W]*pragma:[\\W]*" + pragma + "_START", "gi"),
        endRegx = new RegExp("pragma:[\\W]*" + pragma + "_END[\\W]*\\*/", "gi"),
        rindex = regexIndexOf(str, startRegx);
      while (rindex > -1) {
        finalstr.push(str.substr(pos, rindex - 1));
        str = str.substr(rindex);
        pos = regexIndexOf(str, endRegx);
        str = str.substr(pos);
        str = str.substr(str.indexOf('*/') + 2);
        rindex = regexIndexOf(str, startRegx);
        pos = 0;
      }
      finalstr.push(str);
      return finalstr.join('');
    }
    return str;
  }

  /**
   * Strip all pragma tags
   */
  function stripAllPragma(str) {
    if (typeof(str) === 'string' && str.indexOf('pragma') > -1) {
      var finalstr = [],
        pos = 0,
        startRegx = new RegExp("/\\*[\\W]*pragma:[\\W]*[^_]*_START", "gi"),
        endRegx = new RegExp("pragma:[\\W]*[^_]*_END[\\W]*\\*/", "gi"),
        rindex = regexIndexOf(str, startRegx);
      while (rindex > -1) {
        finalstr.push(str.substr(pos, rindex - 1));
        str = str.substr(rindex);
        pos = regexIndexOf(str, endRegx);
        str = str.substr(pos);
        str = str.substr(str.indexOf('*/') + 2);
        rindex = regexIndexOf(str, startRegx);
        pos = 0;
      }
      finalstr.push(str);
      return finalstr.join('');
    }
    return str;
  }

  function pragma(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError('gulp-pragma', 'Doesn\'t support Streams'));
    }

    if (cfg) {
      if (istextorbinary.isTextSync(file.path, file.contents)) {
        var tContents = file.contents.toString('utf-8');
        for (var pgma in cfg) {
          if (pgma.toLowerCase() == 'all') {
            if (cfg[pgma] === false) {
              tContents = stripAllPragma(tContents);
            }
          } else {
            if (cfg[pgma] === false) {
              tContents = stripPragma(pgma, tContents);
            }
          }
        }
        file.contents = new Buffer(tContents, 'utf-8');
      }
    }

    callback(null, file);
  }

  return through.obj(pragma);
};
