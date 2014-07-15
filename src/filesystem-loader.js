var fs = require("fs");
var path = require("path");

function fileExists(file) {
  return fs.existsSync(file);
}

function getContent(file) {
  return fs.readFileSync(file).toString();
}

function FilesystemLoader() {
  this.paths = Array.prototype.slice.call(arguments);
}

FilesystemLoader.prototype.find = function(file) {
  var paths = this.paths, fullPath;
  for (var i = 0, l = paths.length, current; i < l && !fullPath; i++) {
    current = path.resolve(paths[i], file);
    if (fileExists(current)) {
      fullPath = current;
    }
  }

  return fullPath;
};

FilesystemLoader.prototype.load = function(file) {
  var fullPath = this.find(file);
  if (!fileExists(fullPath)) {
    throw new Error("File '" + file + "' was not found");
  }
  
  return getContent(fullPath);
};

module.exports = FilesystemLoader;