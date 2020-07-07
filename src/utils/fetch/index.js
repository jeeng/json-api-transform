const { URL } = require("url");
const clients = { "http:": require("http"), "https:": require("https") };
const {ConnectionError, JsonParseError} = require("../errors");
const querystring = require("querystring");
const {getAgent} = require("../agents");
const {formatJson} = require("./utils");

module.exports = (url, options = {}) => {
  const u = new URL(url);
  const { protocol } = u;
  const client = clients[protocol];
  const agent = getAgent(protocol);

  if (!client && ! agent)
    throw new Error("TJA fetch error: Unsupported protocol " + protocol);

  const { hostname, port, pathname, search, hash } = u;

  const urlOptions = {
    hostname,
    port: port,
    path: pathname + search + hash
  };

  const { body, responseFormat } = options;
  delete options.body;
  delete options.responseFormat;

  const opts = Object.assign(
    { agent },
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
        resp.on("end", async () => {
          try {
            resolve((await formatJson(data, responseFormat)))
          }
          catch(e) {
            reject(new JsonParseError(data, resp.statusCode, resp.headers));
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