const rewire = require("rewire");
const JAT = rewire("../src");
const testSets = require("./testSets");

const chai = require("chai");
const expect = chai.expect;

const fetchTestSet = async name => {
  const { response: body, mapping, baseMapping, expected } = testSets[name];
  const transform = await JAT.fetch(
    "https://example.com",
    { body },
    mapping,
    baseMapping
  );
  expect(transform).to.deep.equal(expected);
};

const rewiredFetch = async (_, { body }) => ({ json: () => body });

describe(`@JAT tests`, function() {
  let revert;
  before(() => {
    revert = JAT.__set__("fetch", rewiredFetch);
  });

  it("@test1 - transform scalars", () => fetchTestSet("test1"));
  it("@test2 - transform scalars (baseMapping)", () => fetchTestSet("test2"));
  it("@test3 - transform an array response", () => fetchTestSet("test3"));
  it("@test4 - mapping of an array", () => fetchTestSet("test4"));
  it("@test5 - mapping of an object", () => fetchTestSet("test5"));
  it("@test6 - mapping with array_trasform", () => fetchTestSet("test6"));
  it("@test7 - 2-layered mapping", () => {
    throw new Error("NOP");
  });
  it("@test8 - 2-layered array_transform", () => {
    throw new Error("NOP");
  });
  after(() => {
    revert();
  });
});
