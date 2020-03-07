const JAT = require("../src");
const testSets = require("./testSets");

const chai = require("chai");
const expect = chai.expect;

const fetchTestSet = name => {
  const { response: body, mapping, baseMapping, expected } = testSets[name];
  const transform = JAT.fetch(
    "https://example.com",
    { method: "POST", body },
    mapping,
    baseMapping
  );
  expect(transform).to.deep.equal(expected);
};

describe(`@JAT tests`, function() {
  before(() => {
    // rewire fetch
  });
  it("@test1 - mapping of scalars (string, boolean and number)", () =>
    fetchTestSet("test1"));
  it("@test2 - mapping of scalars with baseMapping", () => {
    throw new Error("NOP");
  });
  it("@test3 - transform an array response", () => {
    throw new Error("NOP");
  });
  it("@test4 - mapping of an array", () => {
    throw new Error("NOP");
  });
  it("@test5 - mapping of an object", () => {
    throw new Error("NOP");
  });
  it("@test6 - mapping with array_trasform", () => {
    throw new Error("NOP");
  });
  after(() => {
    // revert rewiring
  });
});
