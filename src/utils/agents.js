const Agents = { http: require("agentkeepalive"), https: require("agentkeepalive").HttpsAgent};
const {agentOptions} = require("./defaults");

let agents = {
  "http:": new Agents.http(Object.assign(agentOptions, {})),
  "https:": new Agents.https(Object.assign(agentOptions, {}))
};

module.exports.getStatistics = () => {
  return Object.keys(agents).map((protocol) => ({ protocol, stats: agents[protocol].getCurrentStatus() }))
};

module.exports.setAgentOptions = (opts) => {
  agents = {
    "http:": new Agents.http(Object.assign(agentOptions, opts || {})),
    "https:": new Agents.https(Object.assign(agentOptions, opts || {}))
  };
};

module.exports.getAgent = (protocol) => {
  return agents[protocol];
}
