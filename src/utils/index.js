const operate = (root, { __operation, args }) => {
  switch (__operation) {
    case "array_transform":
      const { path, mapping } = args;
      const origin = this.getPath({ root }, path);
      if (origin === null)
        throw new Error(
          "Transfrom Error: array_transform path doesn'nt exist."
        );
      if (!Array.isArray(origin))
        throw new Error("Transfrom Error: array_transform path not an Array.");
      return origin.map(item => this.transform(item, mapping));

    default:
      throw new Error("Transfrom Error: unsupported operation: " + __operation);
  }
};

module.exports.getPath = (obj, path) => {
  let varsPath = path.split(".");
  let currval = obj;
  if (
    varsPath.some(varsPathItem => {
      const arrMatch = varsPathItem.match(/^([^\[|^\]]*)\[([^\]]+)\]$/);
      if (!arrMatch) currval = currval[varsPathItem];
      else {
        const idx = parseInt(arrMatch[2]);
        if (!isNaN(idx)) currval = currval[arrMatch[1]][idx];
        else {
          currval = currval[arrMatch[1]].map(el => {
            return getPath(arrMatch[2], el);
          });
        }
      }
      return !currval;
    })
  )
    return null;
  return currval;
};

module.exports.transform = (root, mapping) => {
  const transformed = {};
  Object.keys(mapping).forEach(key => {
    const value = mapping[key];
    switch (typeof value) {
      case "object":
        if (!value.__operation)
          return Object.assign(transformed, {
            [key]: this.transform(root, value)
          });
        return Object.assign(transformed, { [key]: operate(root, value) });
      case "string":
        return Object.assign(transformed, {
          [key]: this.getPath({ root }, value)
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
