const { URL } = require("url");
const clients = { "http:": require("http"), "https:": require("https") };
const defaultPorts = { "http:": 80, "https:": 443 };

module.exports = (url, options = {}) => {
  const u = new URL(url);
  const { protocol } = u;
  const client = clients[protocol];
  if (!client)
    throw new Error("JTA fetch error: Unsupported protocol " + protocol);

  const { hostname, port, pathname, search, hash } = u;

  const urlOptions = {
    hostname,
    port: port,
    path: pathname + search + hash
  };

  const { body } = options;
  delete options.body;

  const opts = Object.assign({}, urlOptions, options);
  opts.headers = opts.headers || {};
  opts.headers["Content-Type"] = "application/json";

  return new Promise((resolve, reject) => {
    const req = client
      .request(opts, resp => {
        let data = "";
        resp.on("data", chunk => (data += chunk));
        resp.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", err => reject(err));

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};
