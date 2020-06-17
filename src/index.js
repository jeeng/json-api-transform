const fetch = require("./utils/fetch");
const {format, parameters} = require('./utils/string-template');
const {getPath, transform} = require("./utils");
const {getStatistics} = require("./utils/agents");

module.exports = class TJA {

  static getStatistics() {
    return getStatistics();
  }

  static async fetch(url, options, mapping, baseMapping) {
    const response = await fetch(url, options);

    if(!mapping) return response;

    const root = baseMapping
      ? getPath({root: response}, baseMapping)
      : response;
    return transform(root, mapping);
  }

  static format(input, ...args) {
    return format(input, ...args);
  }

  static parameters(...inputs) {
    return parameters(...inputs);
  }
};
