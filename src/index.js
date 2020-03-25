const fetch = require("./utils/fetch");
const { getPath, transform } = require("./utils");

module.exports = class TJA {
  static async fetch(url, options, mapping, baseMapping) {
    const response = await fetch(url, options);
    const root = baseMapping
      ? getPath({root: response}, baseMapping)
      : response;
    return transform(root, mapping);
  }
};
