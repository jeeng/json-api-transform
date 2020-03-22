const operate = (root, {__operation, args}) => {
  switch (__operation) {
    case "array_transform":
      const {path, mapping} = args;
      const origin = this.getPath({root}, path);
      if (origin === null)
        throw new Error(
          "Transform Error: array_transform path doesn'nt exist."
        );
      if (!Array.isArray(origin))
        throw new Error("Transform Error: array_transform path not an Array.");
      return origin.map(item => this.transform(item, mapping));

    default:
      throw new Error("Transform Error: unsupported operation: " + __operation);
  }
};

const operators = {
  find: (arr, key, equal) => arr.find(arr => arr[key].trim() === equal)
};

const getKeyWithType = key => {
  if (!isNaN(parseFloat(key)) && isFinite(key)) { // (e.g. "123")
    return ['NUMBER', key];
  } else if (!key.match(/^'.*'$/) && !key.startsWith(':') && !key.endsWith(':') && key.includes(':')) { // is not string and has (:) in the middle (e.g. find:{type: 'email'})
    return ['OPERATOR'].concat(key.split(/[:{}]/g) // : or { or }
      .map(item => item.trim().replace(/^'|'$/g, '').trim()) // without the surrounding single quotes
      .filter(Boolean));
  } else {
    return ['STRING', key.replace(/^'|'$/g, '').trim()]; // without the surrounding single quotes
  }
};

// TODO: TBD, Currently we do not support dots (.) or square brackets ([]) or quotes (') in keys
//  and strings should be with SINGLE quote
module.exports.getPath = (obj, path) => {
  let pathSegments = path.split(/]\[|]|\[|\./g).map(item => item.trim()).filter(Boolean);
  let currval = obj;

  const result = pathSegments.some(segment => {
    const [type, key, ...arg] = getKeyWithType(segment);
    if (type !== 'OPERATOR') {
      currval = currval[key];
    } else {
      if (!operators[key]) {
        throw new Error(`Invalid operator: ${key}`);
      }
      currval = operators[key](currval, ...arg);
    }
    return !currval;
  });

  return result ? null : currval;
};

module.exports.transform = (root, mapping) => {
  const transformed = {};
  if (typeof mapping === "string") {
    return this.getPath({root}, mapping);
  }

  if (mapping.__operation) {
    return Object.assign(transformed, operate(root, mapping));
  }

  Object.keys(mapping).forEach(key => {
    const value = mapping[key];
    switch (typeof value) {
      case "object":
        if (!value.__operation)
          return Object.assign(transformed, {
            [key]: this.transform(root, value)
          });
        return Object.assign(transformed, {[key]: operate(root, value)});
      case "string":
        return Object.assign(transformed, {
          [key]: this.getPath({root}, value)
        });

      default:
        return new Error(
          "Transform Error: unsupported value type: " +
          value +
          ", for key: " +
          key
        );
    }
  });
  return transformed;
};
