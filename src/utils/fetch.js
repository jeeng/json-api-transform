const { URL } = require("url");
const clients = { "http:": require("http"), "https:": require("https") };
const defaults = require('./defaults');
const {ConnectionError, JsonParseError} = require("./errors");
const querystring = require("querystring");
const {getAgent} = require("./agents");

module.exports = (url, options = {}) => {
  const u = new URL(url);
  const { protocol } = u;
  const client = clients[protocol];
  const agent = getAgent(protocol);

  if (!client)
    throw new Error("TJA fetch error: Unsupported protocol " + protocol);

  const { hostname, port, pathname, search, hash } = u;

  const urlOptions = {
    hostname,
    port: port,
    path: pathname + search + hash
  };

  const { body } = options;
  delete options.body;

  const opts = Object.assign(
    { agent },
    defaults.fetchOptions,
    urlOptions,
    options
  );


  opts.headers = opts.headers || {};
  opts.headers["Content-Type"] = opts.headers["Content-Type"] || "application/json";

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
            reject(new JsonParseError(data.substring(0, 100)));
          }
        });
      })
      .on("error", err => reject(new ConnectionError(err)));

    if (body) {
      if (opts.headers["Content-Type"] === "application/x-www-form-urlencoded")  {
        req.write(querystring.stringify(body));
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
};
