module.exports = class JsonParseError extends Error {
  constructor(responseText) {
    super("Bad JSON input");
    this.responseText = responseText;
  }
};