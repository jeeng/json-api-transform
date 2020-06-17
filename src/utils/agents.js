const Agents = { http: require("agentkeepalive"), https: require("agentkeepalive").HttpsAgent};
const {agentOptions} = require("./defaults");

agents = null;
module.exports.getStatistics = () => {
  return agents.map((agent, protocol) => ({ protocol, stats: agent.getCurrentStatus() }))
};

module.exports.createAgents = (opts) => {
  agents = {
    "http:": new Agents.http(Object.assign(agentOptions, opts || {})),
    "https:": new Agents.https(Object.assign(agentOptions, opts || {}))
  };
};

module.exports.getAgent = (protocol) => {
  if ( ! agents) this.createAgents({});
  return agents[protocol];
}
