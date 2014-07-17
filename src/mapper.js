var path = require("path");

function split(name) {
  return name.split(path.sep);
}

function addToTree(tree, parts) {
  var head = parts.pop(),
      current = tree[head],
      node;

  if (!current) {
    // Key doesn't exist, add to current level
    tree[head] = parts;
  } else if (Array.isArray(current)) {
    // Key is taken - create a new level
    node = {};
    node[current.pop()] = current;
    node[parts.pop()] = parts;
    tree[head] = node;
  } else {
    // Add to next level recursively
    addToTree(current, parts);
  }
}

function createMappingTree(list) {
  var mappingTree = {};
  list.forEach(function(name) {
    addToTree(mappingTree, split(name));
  });

  return mappingTree;
}

function findPath(mappingTree, parts) {
  var head = parts.pop(),
      current = mappingTree[head],
      treePath;

  if (!current) {
    return [];
  } else if (Array.isArray(current)) {
    treePath = [head];
  } else {
    treePath = findPath(current, parts);
    treePath.push(head);
  }

  return treePath;
}

function create(list) {
  var mappingTree = createMappingTree(list);

  return function(name) {
    var treePath = findPath(mappingTree, split(name));

    return treePath.length ? treePath.join("_") : null;
  }
}

module.exports.create = create;