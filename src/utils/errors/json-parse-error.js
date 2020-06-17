module.exports = class JsonParseError extends Error {
  constructor(responseText, statusCode, headers) {
    super("Bad JSON input");
    this.responseText = responseText;
    this.headers = headers;
    this.statusCode = statusCode;
  }
};