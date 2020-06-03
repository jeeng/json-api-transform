module.exports = class ConnectionError extends Error {
  constructor(message) {
    super(message);
  }
};