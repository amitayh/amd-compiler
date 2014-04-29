function Loader() {
  this.files = {};
}

Loader.prototype.addFile = function(name, source) {
  this.files[name] = source;
};

Loader.prototype.load = function(name) {
  return this.files[name];
};

module.exports = Loader;