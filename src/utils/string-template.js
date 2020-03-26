const nargs = /{([0-9a-zA-Z_]+)}/g;

function replace(string, args = {}) {
  const isJson = typeof string === "object";
  const keys = {};

  if (isJson) {
    string = JSON.stringify(string);
  }

  if (args.length === 1 && typeof args[0] === "object") {
    args = args[0]
  }

  string = string.replace(nargs, function replaceArg(match, i, index) {
    keys[i] = true;

    if (string[index - 1] === "{" && string[index + match.length] === "}") {
      return i;
    } else {
      return args.hasOwnProperty(i) ? args[i] : '';
    }
  });

  if (isJson) {
    string = JSON.parse(string);
  }

  return {string, keys: Object.keys(keys)};
}

function format(string, ...args) {
  return replace(string, args).string;
}

function parameters(...args) {
  const results = args.map(arg => replace(arg).keys);

  return results.length === 1 ? results[0] : results;
}

module.exports = {format, parameters};
