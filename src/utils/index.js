const operate = ({ __operation, args }) => {};

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

module.exports.transform = (obj, mapping, baseMapping) => {
  let root = obj;
  if (baseMapping) {
    baseValue = this.getPath({ root }, baseMapping);
    if (!baseValue)
      throw (new Error("Transform Error: baseMapping failed.")({
        root
      }) = baseValue);
  }
  transformed = {};
  Object.keys(mapping).forEach(key => {
    const value = mapping[key];
    switch (typeof value) {
      case "object":
        if (!value.__operation)
          return Object.assign(transformed, {
            [key]: this.transform(root, value)
          });
        return Object.assign(transformed, { [key]: operate(value) });
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
