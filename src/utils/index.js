require('array-flat-polyfill');

const toJson = mapping => {
  try {
    return JSON.parse(mapping);
  } catch (e) {
    return mapping;
  }
};

const splitToArgs = str => {
  const brackets = {
    "(": 0,
    "[": 0,
    "{": 0
  };

  let pos = 0;
  const args = [];

  [...str].forEach((char, i) => {
    if (char in brackets) brackets[char]++;

    else if (char === ")") brackets["("]--;
    else if (char === "]") brackets["["]--;
    else if (char === "}") brackets["{"]--;

    else if (brackets["("] + brackets["["] + brackets["{"] !== 0) return null;

    else if (char === ",") {
      args.push(str.substring(pos, i));
      pos = i + 1;
    }
  });

  args.push(str.substring(pos));

  return args
    .map(arg => arg.trim())
    .filter(Boolean);
};

const operators = {
  find: (arr, path, value) => arr.find(root => this.transform(root, path) === value),
  filter: (arr, path, value) => arr.filter(root => this.transform(root, path) === value),
  map: (arr, path) => arr.map(root => this.transform(root, path)),
  split: (string, delimiter) => string.split(delimiter),
  flat: (arr) => arr.flat()
};

const operatorsRegexp = new RegExp(`^(${Object.keys(operators).join('|')})\\((.*)\\)$`);
const openersRegexp = new RegExp(['[', '.'].map(opener => '\\' + opener).join('|'));

const getOperatorsArg = key => {
  const match = key.match(operatorsRegexp);

  if (!match) return {};

  const [, name, argsStr] = match;

  const args = splitToArgs(argsStr)
    .map(item => {
      item = item.trim();

      if (!item.startsWith("'")) return toJson(item);

      return item.replace(/^'|'$/g, '')
    })
    .filter(Boolean);

  return { name, args };
};

const getBracketsArg = path => {
  const brackets = { '[': 0 };

  let arg = '';
  brackets[path[0]]++;
  [...path.substring(1)].some(char => {
    if (char in brackets) brackets[char]++;
    if (char === ']') brackets['[']--;
    if (brackets['['] === 0) return true;
    arg += char;
    return false;
  });

  return arg;
};

module.exports.getPath = (root, path) => {
  path = (path || '').trim();

  // remove leading dot (.) in case dot after closing bracket e.g. ['root'].value
  path = path.startsWith('.') ? path.substring(1).trim() : path;

  if (!path.trim()) return root;

  const match = path.match(openersRegexp);

  if (!match) return root[path];

  const { 0: delimiter, index: pos } = match;

  let nextPath;
  let key;

  switch (delimiter) {
    case '.':
      key = path.substring(0, pos);
      nextPath = path.substring(key.length + 1);
      return this.getPath(root[key], nextPath);
    case '[':
      if (pos > 0) {
        key = path.substring(0, pos);
        nextPath = path.substring(key.length);
        return this.getPath(root[key], nextPath);
      }

      key = getBracketsArg(path);
      nextPath = path.substring(key.length + 2);

      key = key.trim().replace(/^'|'$/g, '');

      const { name, args } = getOperatorsArg(key);
      if (!name) return this.getPath(root[key], nextPath);

      const nextRoot = operators[name](root, ...args);
      return this.getPath(nextRoot, nextPath);
  }
};

module.exports.transform = (root, mapping) => {
  let transformed = {};

  if (typeof mapping === 'string') {
    return this.getPath({ root }, mapping);
  }

  Object.keys(mapping).forEach(key => {
    let value = mapping[key];

    return Object.assign(transformed, {
      [key]: typeof value === 'object' ? this.transform(root, value) : this.getPath({ root }, value)
    });
  });

  return transformed;
};

