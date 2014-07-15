var fs = require("fs");
var path = require("path");

function fileExists(file) {
  return fs.existsSync(file);
}

function getContent(file) {
  return fs.readFileSync(file).toString();
}

function FilesystemLoader(paths) {
  this.paths = Array.isArray(paths) ? paths : [paths];
}

FilesystemLoader.prototype.resolve = function(file, base) {
  var paths = this.paths, fullPath;

  file = path.join(base || "", file);
  for (var i = 0, l = paths.length, current; i < l && !fullPath; i++) {
    current = path.resolve(paths[i], file);
    if (fileExists(current)) {
      fullPath = current;
    }
  }

  return fullPath;
};

FilesystemLoader.prototype.load = function(file) {
  if (!fileExists(file)) {
    throw new Error("File '" + file + "' was not found");
  }
  
  return getContent(file);
};

module.exports = FilesystemLoader;