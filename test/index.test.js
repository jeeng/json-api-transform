const rewire = require("rewire");
const TJA = rewire("../src");
const originalTJA = require("../src");
const {setAgentOptions} = require("../src/utils/agents");
const testSets = require("./testSets");

const chai = require("chai");
const expect = chai.expect;

const fetchTestSet = async name => {
  const {response: body, mapping, baseMapping, expected} = testSets[name];
  const transform = await TJA.fetch(
    "https://example.com",
    {body},
    mapping,
    baseMapping
  );

  expect(transform).to.deep.equal(expected);
};

const rewiredFetch = async (_, {body}) => body;

describe(`@TJA tests`, function () {
  let revert;
  this.timeout(10000);
  before(() => {
    revert = TJA.__set__("fetch", rewiredFetch);
  });

  it("@test1 - transform scalars", () => fetchTestSet("test1"));
  it("@test2 - transform scalars (baseMapping)", () => fetchTestSet("test2"));
  it("@test3 - transform an array response", () => fetchTestSet("test3"));
  it("@test4 - mapping of an array", () => fetchTestSet("test4"));
  it("@test5 - mapping of an object", () => fetchTestSet("test5"));
  it("@test6 - mapping with map", () => fetchTestSet("test6"));

  it("@test7 - 2-layered mapping", () => fetchTestSet("test7"));
  it("@test8 - 2-layered map", () => fetchTestSet("test8"));
  it("@test9 - real fetch (GET)", async () => {
    const res = await originalTJA.fetch(
      "https://postman-echo.com/get?foo1=bar1&foo2=bar2",
      {},
      {
        foo1: "root.args.foo1",
        foo2: "root.args.foo2",
        host: {name: "root.headers.host"}
      }
    );
    expect(res).to.deep.equal({
      foo1: "bar1",
      foo2: "bar2",
      host: {name: "postman-echo.com"}
    });
  });
  it("@test10 - real fetch (POST)", async () => {
    const res = await originalTJA.fetch(
      "https://postman-echo.com/post?foo1=bar1&foo2=bar2",
      {
        method: "POST",
        body: {foo1: "bar1", foo2: "bar2"}
      },
      {
        foo1: "root.args.foo1",
        foo2: "root.args.foo2",
        host: {name: "root.headers.host"}
      }
    );
    expect(res).to.deep.equal({
      foo1: "bar1",
      foo2: "bar2",
      host: {name: "postman-echo.com"}
    });
  });
  it("@test11 - transform mapping starts with brackets ([)", () => fetchTestSet("test11"));
  it("@test12 - transform with keys as a strings (')", () => fetchTestSet("test12"));
  it("@test13 - transform with spaces between keys", () => fetchTestSet("test13"));
  it("@test14 - transform with spaces in keys", () => fetchTestSet("test14"));
  it("@test15 - transform with quote in keys", () => fetchTestSet("test15"));
  it("@test16 - transform nested path with operators", () => fetchTestSet("test16"));
  it("@test17 - transform nested path with object argument", () => fetchTestSet("test17"));
  it("@test18 - transform nested path with multiple args ", () => fetchTestSet("test18"));

  it("@test19 - return socket error", async () => {
    await originalTJA.fetch(
      "https://postman-echo.com/time/format?213123",
      {timeout: 1},
      {}
    ).catch(e => {
      expect(e.message).to.equal("Error: Socket timeout");
      return true;
    })
      .then(r => {
        expect(r).to.be.true
      });
  });

  it("@test20 - return socket error", async () => {
    await originalTJA.fetch(
      "http://google.com",
      {},
      {}
    ).catch(e => {
      expect(e.message).to.equal("Bad JSON input");
      expect(e.statusCode).to.equal(301);
      expect(e.headers).to.exist;
      expect(e.headers["content-type"]).to.equal("text/html; charset=UTF-8");

      return true;
    })
      .then(r => {
        expect(r).to.be.true
      });
  });

  it("@test21 - form data real fetch", async () => {
    const res = await originalTJA.fetch(
      "https://postman-echo.com/post?foo1=bar1&foo2=bar2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          foo1: "bar1"
        }
      },
      {
        test: "root.form.foo1",
      }
    );
    expect(res).to.deep.equal({
      test: "bar1",
    });
  });

  it("@test22 - show statistics", async () => {
    setAgentOptions({});
    Array(10).fill().map(() => {
      originalTJA.fetch(
        "https://postman-echo.com/post?foo1=bar1&foo2=bar2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: {
            foo1: "bar1"
          }
        },
        {
          test: "root.form.foo1",
        }
      );
    });

    const stats = originalTJA.getStatistics();
    expect(stats[1].stats.createSocketCount).to.equal(10);
  });

  it("@test23 - parse CSV response to JSON", async () => {
    setAgentOptions({});
    const response = await originalTJA.fetch(
      "http://samplecsvs.s3.amazonaws.com/SalesJan2009.csv",
      {
        responseFormat: "csv",
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          foo1: "bar1"
        }
      },
      {
        items: "root[map({\"test\": \"root.Product\", \"price\": \"root.Price\"})]",
      }
    );

    expect(response.items).to.be.an('array')
    expect(response.items.length).to.at.least(3);

    response.items.map(item => {
      expect(item).to.contain.keys(["test", "price"]);
      expect(parseInt(item.price)).to.be.an('number');
    })
  });

  it("@test24 - mapping with split and map", () => fetchTestSet("test24"));
  it("@test25 - mapping with split", () => fetchTestSet("test25"));
});