const Agents = { http: require("agentkeepalive"), https: require("agentkeepalive").HttpsAgent};
const {agentOptions} = require("./defaults");

agents = null;
module.exports.setAgentOptions = (opts = {}) => {
  if ( ! agents)
    agents = {
      "http:": new Agents.http(Object.assign(agentOptions, opts || {})),
      "https:": new Agents.https(Object.assign(agentOptions, opts || {}))
    };

  return agents;
};

module.exports.setLogger = (cb = console.log) => {
  Object.values(agents).map(agent => {
    setInterval(() => {
      cb(agent.statusChanged, agent.getCurrentStatus());
    }, 2000);
  })
};

module.exports.getAgent = protocol => {
  const agents = this.setAgentOptions();
  return agents[protocol];
};
