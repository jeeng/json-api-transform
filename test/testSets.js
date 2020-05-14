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
        normalized: `root.items[map({"index":"root.id"})]`
    },
    expected: {
      normalized: [{ index: 1 }, { index: 2 }, { index: 3 }]
    }
  },
  test7: {
    response: [1, 2, 3],
    mapping: {a:{b: "root[1]"}},
    expected: { a: { b: 2 } }
  },
  test8: {
    response: [1, 2, 3],
    mapping: {a:{b: `root[map({"index":"root"})]`}},
    expected: { a: { b: [{ index: 1 }, { index: 2 }, { index: 3 }] } }
  },
  test11: {
    response: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mapping: {
      second_item: "[root][1].id"
    },
    expected: { second_item: 2 }
  },
  test12: {
    response: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mapping: {
      second_item: "['root'][1].id"
    },
    expected: { second_item: 2 }
  },
  test13: {
    response: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mapping: {
      second_item: "['root'] [1] . id"
    },
    expected: { second_item: 2 }
  },
  test14: {
    response: [{ "i'd": 1 }, { "i'd": 2 }, { "i'd": 3 }],
    mapping: {
      second_item: "['root'][1]['i'd']"
    },
    expected: { second_item: 2 }
  },
  test15: {
    response: [{ " id": 1 }, { " id": 2 }, { " id": 3 }],
    mapping: {
      second_item: "['root'][1][' id']"
    },
    expected: { second_item: 2 }
  },
  test16: {
    response: [{ids:[[1]]}, {ids:[[2]]}, {ids:[[3]]}],
    mapping: {a: `root[map({"items":"root.ids[flat()]"})]`},
    expected: {a: [{items: [1]}, {items: [2]}, {items: [3]}]}
  },
  test17: {
    response: [
      { title: 'title1', body: 'body1' },
      { title: 'title2', body: 'body2' }
    ],
    mapping: `root[map({"koteret":"root.title", "guf":"root.body"})]`,
    expected: [
      {koteret: 'title1', guf: 'body1'},
      {koteret: 'title2', guf: 'body2'}
    ]
  },
  test18: {
    response: [[{visible: true, id: 1}, {visible: false, id: 2}, {visible: true, id: 3}]],
    mapping: {a: `root[map({"items":"root[filter(root.visible, true)]"})]`},
    expected: {a: [{items: [{visible: true, id: 1}, {visible: true, id: 3}]}]}
  },
  test19: {
    response: {
      "items": [
        {
          "title": "title3",
          "body": "body3",
          "cpc": "2.10",
          "url": "https://api.nostromedia.com/click?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          "image": "https://api.nostromedia.com/imp?token=CwiZXhwIjoxNTg2NzY5OTk4fQ.Glp2rpJDFZhyHtX5anlDGFpeop1lt3115NHVqTrIOQM"
        },
        {
          "title": "title3",
          "body": "body3",
          "cpc": "1.80",
          "url": "https://api.nostromedia.com/click?token=eyJhZElkIjoiYjcwODA5OWQtNjk5MS01MThmLWJlMDctNTRmYTM3ODQ3MGFkIiwidXJsIjoi",
          "image": "http://api.nostromedia.com/imp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9OiJIUzI1NiIsInR"
        },
        {
          "title": "title2",
          "body": "body2",
          "cpc": "1.50",
          "url": "https://api.nostromedia.com/click?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZElk",
          "image": "https://api.nostromedia.com/imp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZElkIjoiMjJhZDk1MDUtO"
        }
      ]
    },
    mapping: {a: `root[map({"items":"root[filter(root.visible, true)]"})]`},
    expected: {a: [{items: [{visible: true, id: 1}, {visible: true, id: 3}]}]}
  }
};
