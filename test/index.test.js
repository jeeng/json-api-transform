const rewire = require("rewire");
const TJA = rewire("../src");
const originalTJA = require("../src");
const testSets = require("./testSets");

const chai = require("chai");
const expect = chai.expect;

const fetchTestSet = async name => {
  const { response: body, mapping, baseMapping, expected } = testSets[name];
  const transform = await TJA.fetch(
    "https://example.com",
    { body },
    mapping,
    baseMapping
  );
  expect(transform).to.deep.equal(expected);
};

const rewiredFetch = async (_, { body }) => body;

describe(`@TJA tests`, function() {
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
        host: { name: "root.headers.host" }
      }
    );
    expect(res).to.deep.equal({
      foo1: "bar1",
      foo2: "bar2",
      host: { name: "postman-echo.com" }
    });
  });
  it("@test10 - real fetch (POST)", async () => {
    const res = await originalTJA.fetch(
      "https://postman-echo.com/post?foo1=bar1&foo2=bar2",
      {
        method: "POST",
        body: { foo1: "bar1", foo2: "bar2" }
      },
      {
        foo1: "root.args.foo1",
        foo2: "root.args.foo2",
        host: { name: "root.headers.host" }
      }
    );
    expect(res).to.deep.equal({
      foo1: "bar1",
      foo2: "bar2",
      host: { name: "postman-echo.com" }
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
  it("@test18 - transform nested path with multiple args ", () => fetchTestSet("test19"));

  it("@test19 - return bad JSON input", async () => {
    // https://postman-echo.com/time/format?timestamp=20&&&16-10-10&format123mm
    const res = await originalTJA.fetch(
      "https://postman-echo.com/time/format?timestamp=20&&&16-10-10&format123mm",
      {  },
      {}
    ).catch(e => {
      expect(e.message).to.equal("Bad JSON input");
    });
  });

  it("@test20 - return socket error", async () => {
    // https://postman-echo.com/time/format?timestamp=20&&&16-10-10&format123mm
    const res = await originalTJA.fetch(
      "https://postman-echo.com/time/format?timestamp=20&&&16-10-10&format123mm",
      { timeout: 10 },
      {}
    ).catch(e => {
      expect(e.message).to.equal("Error: socket hang up");
    });
  });
});
