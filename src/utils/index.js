require('array-flat-polyfill');

const operators = {
  find: (arr, path, value) => arr.find(root => this.transform(root, path).trim() === value),
  filter: (arr, path, value) => arr.filter(root => this.transform(root, path).trim() === value),
  map: (arr, path) => arr.map(root => this.transform(root, path)),
  flat: (arr) => arr.flat()
};

const getOperatorsArg = path => {
  const pos = path.indexOf('(');
  const name = path.substring(0, pos);
  const argsStr = getBracketsArg(path.substring(pos));

  const args = argsStr.split(',')
    .map(item => item.trim().replace(/^'|'$/g, '').trim())
    .filter(Boolean);

  return {name, args};
};

const getBracketsArg = path => {
  const brackets = {
    "(": 0,
    "[": 0
  };
  let arg = "";
  brackets[path[0]]++;
  [...path.substring(1)].some(char => {
    if (char in brackets) brackets[char]++;
    if (char === ")") brackets["("]--;
    if (char === "]") brackets["["]--;
    if (brackets["("] + brackets["["] === 0) return true;
    arg += char;
    return false;
  });
  return arg;
};

// e.g. starts with find(
const operatorsPattern = Object.keys(operators).map(o => `^${o}\\(`).join('|');

const isOperator = str => (str.match(new RegExp(operatorsPattern)) || [])[0];

module.exports.getPath = (root, path) => {
  path = path.startsWith('.') ? path.substring(1) : path;

  const openersPattern = '\\' + ['[', '(', '.'].join('|\\');
  const regexp = new RegExp(openersPattern + '|' + operatorsPattern);
  const match = path.match(regexp);

  if (!match) return root[path];

  const {0: delimiter, index: pos} = match;

  let nextRoot;
  let nextPath;
  let key;

  switch (delimiter) {
    case ".":
      key = path.substring(0, pos);
      nextPath = path.substring(key.length + 1);
      break;
    case '[':
      if (pos === 0) {
        key = getBracketsArg(path);
        nextPath = path.substring(key.length + 2);
      } else {
        key = path.substring(0, pos);
        nextPath = path.substring(key.length);
      }
      break;
  }

  if (isOperator(key)) {
    const {name, args} = getOperatorsArg(key);
    nextRoot = operators[name](root, ...args);
  } else {
    const strippedKey = key.trim().replace(/^'|'$/g, '').trim();
    nextRoot = root[strippedKey];
  }

  if (!nextPath) {
    return nextRoot;
  }

  return this.getPath(nextRoot, nextPath);
};

const toJson = (mapping) => {
  if (mapping.startsWith('{') && mapping.endsWith('}')) {
    const [key, value] = mapping
      .substring(1, mapping.length - 1)
      .split(/:(.*)/)
      .map(str => str.trim()).filter(Boolean);

    return {[key]: toJson(value)};
  }

  return mapping;
};

module.exports.transform = (root, mapping) => {
  let transformed = {};

  if (typeof mapping === "string") {
    mapping = toJson(mapping);

    if (typeof mapping === "string")
      return this.getPath({root}, mapping);
  }

  Object.keys(mapping).forEach(key => {
    let value = mapping[key];

    return Object.assign(transformed, {
      [key]: typeof value === 'object' ? this.transform(root, value) : this.getPath({root}, value)
    });
  });

  return transformed;
};
