module.exports = {
  test1: {
    response: {
      data: {
        numeric: 1.2,
        boolean: true,
        string: "a string"
      }
    },
    mapping: {
      num: "root.data.numeric",
      bool: "root.data.boolean",
      str: "root.data.string"
    },
    expected: {
      num: 1.2,
      bool: true,
      str: "a string"
    }
  },
  test2: {
    response: {
      data: {
        numeric: 1.2,
        boolean: true,
        string: "a string"
      }
    },
    baseMapping: "root.data",
    mapping: {
      num: "root.numeric",
      bool: "root.boolean",
      str: "root.string"
    },
    expected: {
      num: 1.2,
      bool: true,
      str: "a string"
    }
  },
  test3: {
    response: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mapping: {
      second_item: "root[1].id"
    },
    expected: { second_item: 2 }
  },
  test4: {
    response: { items: [1, 2, 3] },
    mapping: { res: "root.items" },
    expected: { res: [1, 2, 3] }
  },
  test5: {
    response: { props: { a: "a", b: "b", c: 3 } },
    mapping: { res: "root.props" },
    expected: { res: { a: "a", b: "b", c: 3 } }
  },
  test6: {
    response: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    mapping: {
      normalized: {
        __operation: "array_transform",
        args: {
          path: "root.items",
          mapping: { index: "root.id" }
        }
      }
    },
    expected: {
      normalized: [{ index: 1 }, { index: 2 }, { index: 3 }]
    }
  },
  test7: {
    response: [1, 2, 3],
    mapping: {
      a: {
        b: "root[1]"
      }
    },
    expected: { a: { b: 2 } }
  },
  test8: {
    response: [1, 2, 3],
    mapping: {
      a: {
        b: {
          __operation: "array_transform",
          args: {
            path: "root",
            mapping: {
              index: "root"
            }
          }
        }
      }
    },
    expected: { a: { b: [{ index: 1 }, { index: 2 }, { index: 3 }] } }
  }
};
