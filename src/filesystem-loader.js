var fs = require("fs");
var path = require("path");

function fileExists(file) {
  return fs.existsSync(file);
}

function getContent(file) {
  return fs.readFileSync(file).toString();
}

function FilesystemLoader(root) {
  this.root = root;
}

FilesystemLoader.prototype.load = function(file) {
  var fullPath = path.resolve(this.root, file);
  if (!fileExists(fullPath)) {
    throw new Error("File '" + file + "' was not found");
  }
  
  return getContent(fullPath);
};

module.exports = FilesystemLoader;