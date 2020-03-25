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
  it("@test6 - mapping with array_transform", () => fetchTestSet("test6"));
  it("@test7 - 2-layered mapping", () => fetchTestSet("test7"));
  it("@test8 - 2-layered array_transform", () => fetchTestSet("test8"));
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
    const res = await originalJAT.fetch(
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
});
