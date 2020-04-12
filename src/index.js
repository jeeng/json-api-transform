const fetch = require("./utils/fetch");
const {format, parameters} = require('./utils/string-template');
const {getPath, transform} = require("./utils");

module.exports = class TJA {
  static async fetch(url, options, mapping, baseMapping) {
    const response = await fetch(url, options).catch((e) => {
      throw new Error("TJA Error: bad response");
    });

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
