const { URL } = require("url");
const clients = { "http:": require("http"), "https:": require("https") };
const defaults = require('./defaults');

module.exports = (url, options = {}) => {
  const u = new URL(url);
  const { protocol } = u;
  const client = clients[protocol];
  if (!client)
    throw new Error("TJA fetch error: Unsupported protocol " + protocol);

  const { hostname, port, pathname, search, hash } = u;

  const urlOptions = {
    hostname,
    port: port,
    path: pathname + search + hash
  };

  const { agent, body } = options;
  delete options.body;


  const agentOptions = Object.assign(defaults.agentOptions, agent === Object(agent) && agent);
  delete options.agent;

  const opts = Object.assign(
    { agent: new client.Agent(agentOptions) },
    defaults.fetchOptions,
    urlOptions,
    options
  );
  opts.headers = opts.headers || {};
  opts.headers["Content-Type"] = "application/json";

  return new Promise((resolve, reject) => {
    const req = client
      .request(opts, resp => {
        let data = "";
        resp.on("data", chunk => (data += chunk));
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data))
          }
          catch(e) {
            reject(e);
          }
        });
      })
      .on("error", err => reject(err));

      req.setTimeout(opts.timeout, req.abort);

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};
