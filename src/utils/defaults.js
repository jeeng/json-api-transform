module.exports.fetchOptions = {
  timeout: parseInt(process.env.JTA_FETCH_TIMEOUT) || 10000,
};

module.exports.agentOptions ={
  maxSockets: Infinity,
  keepAlive: false
};