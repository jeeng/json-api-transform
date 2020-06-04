const fetch = require("./utils/fetch");
const {format, parameters} = require('./utils/string-template');
const {getPath, transform} = require("./utils");
const {setAgentOptions, setLogger} = require("./utils/agents");

module.exports = class TJA {
  static async fetch(url, options, mapping, baseMapping) {
    const response = await fetch(url, options);

    const root = baseMapping
      ? getPath({root: response}, baseMapping)
      : response;
    return transform(root, mapping);
  }

  static setAgent(opts, logger = console.log) {
    setAgentOptions(opts);
    setLogger(logger);
  }


  static format(input, ...args) {
    return format(input, ...args);
  }

  static parameters(...inputs) {
    return parameters(...inputs);
  }
};
