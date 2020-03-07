const fetch = require("node-fetch");
const { getPath, transform } = require("./utils");

module.exports = class JAT {
  static async fetch(url, options, mapping, baseMapping) {
    const response = await fetch(url, options).then(res => res.json());
    const root = baseMapping
      ? getPath({ root: response }, baseMapping).root
      : response;
    return transform(root, mapping);
  }
};
