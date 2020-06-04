module.exports.fetchOptions = {
  timeout: parseInt(process.env.TJA_FETCH_TIMEOUT) || 10000,
};

module.exports.agentOptions = {
  maxSockets: 1000,
  maxFreeSockets: 10,
  timeout: 1000,
  freeSocketTimeout: 30000,
};
