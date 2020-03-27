Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});

const operators = {
  find: (arr, path, value) => arr.find(root => this.getPath({root}, path).trim() === value),
  filter: (arr, path, value) => arr.filter(root => this.getPath({root}, path).trim() === value),
  map: (arr, path) => arr.map(root => this.getPath({root}, path)),
  flat: (arr) => arr.flat()
};

const getKeyWithType = key => {
  const operatorPrefixRegexp = new RegExp(Object.keys(operators).map(o => `^${o}\\(`).join('|'), 'g'); // e.g. starts with find(

  if (!isNaN(parseFloat(key)) && isFinite(key)) { // (e.g. "123")
    return ['NUMBER', key];
  } else if (key.match(operatorPrefixRegexp) && key.endsWith(')')) { // is not string and has (:) in the middle (e.g. find:{type: 'email'})
    return ['OPERATOR'].concat(key.split(/[(),]/g) // split by or ( or ) or ,
      .map(item => item.trim().replace(/^'|'$/g, '').trim()) // without the surrounding single quotes
      .filter(Boolean));
  } else {
    return ['STRING', key.replace(/^'|'$/g, '').trim()]; // without the surrounding single quotes
  }
};

function parsePath(str) {
  let match;
  let level = 0;
  let mute = 0;
  let lastPos = 0;
  let segments = [];

  const delimiters = [']', '[', ')', '(', '.'];
  const regexp = new RegExp('\\' + delimiters.join('|\\'), 'g');

  while ((match = regexp.exec(str + '.')) !== null) {
    const {0: char, index: pos} = match;

    if (char === '(') mute++;

    if (char === ')' && mute > 0) mute--;

    if (mute) continue;

    const substr = str.substring(lastPos, pos);
    const isOpeningBracket = char === '[' && level++ === 0;
    const isClosingBracket = char === ']' && (level = Math.max(0, --level)) === 0;

    if (isOpeningBracket || isClosingBracket || char === '.') {
      segments = segments.concat(substr);
      lastPos = pos + 1;
    }
  }

  return segments.map(item => item.trim()).filter(Boolean);
}

module.exports.getPath = (obj, path) => {
  const pathSegments = parsePath(path);
  let currval = obj;

  pathSegments.some(segment => {
    const [type, key, ...arg] = getKeyWithType(segment);
    if (type !== 'OPERATOR') {
      currval = currval[key];
    } else {
      currval = operators[key](currval, ...arg);
    }
    return !currval;
  });

  return currval;
};

module.exports.transform = (root, mapping) => {
  const transformed = {};

  if (typeof mapping === "string") {
    return this.getPath({root}, mapping);
  }

  Object.keys(mapping).forEach(key => {
    const value = mapping[key];

    return Object.assign(transformed, {
      [key]: this.getPath({root}, value)
    });
  });

  return transformed;
};
