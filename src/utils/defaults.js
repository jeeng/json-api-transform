module.exports.fetchOptions = {
  timeout: parseInt(process.env.TJA_FETCH_TIMEOUT) || 10000,
};

module.exports.agentOptions = {
  maxSockets: Infinity,
  keepAlive: false
};
