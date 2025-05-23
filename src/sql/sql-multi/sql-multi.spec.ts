/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SqlExpression } from '../..';
import { backAndForth } from '../../test-utils';

describe('OR expression', () => {
  it('single expression with unquoted string', () => {
    const sql = `A OR B`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with single quoted string', () => {
    const sql = `'A' OR 'B'`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'A'",
              "type": "literal",
              "value": "A",
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'B'",
              "type": "literal",
              "value": "B",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with double quoted string', () => {
    const sql = `"A" OR "B"`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with numbers', () => {
    const sql = `1 OR 2`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('brackets', () => {
    const sql = `(1 OR 2)`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('strange spacing and brackets', () => {
    const sql = `1   OR 2`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": "   ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('strange spacing and brackets', () => {
    const sql = `( 1   OR 2 )`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": "   ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": Array [
          Object {
            "leftSpacing": " ",
            "rightSpacing": " ",
          },
        ],
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});

describe('AND expression', () => {
  it('single expression with unquoted string', () => {
    const sql = `A AND B`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with single quoted string', () => {
    const sql = `'A' AND 'B'`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'A'",
              "type": "literal",
              "value": "A",
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'B'",
              "type": "literal",
              "value": "B",
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with double quoted string', () => {
    const sql = `"A" AND "B"`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with numbers', () => {
    const sql = `1 AND 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('brackets', () => {
    const sql = `(1 AND 2)`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});

describe('Math expression', () => {
  it('Addition', () => {
    const sql = `1 + 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Subtraction', () => {
    const sql = `1 - 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "-",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "-",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Multiplication', () => {
    const sql = `1 * 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "*",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "*",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Division', () => {
    const sql = `1 / 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "/",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "/",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with unquoted string', () => {
    const sql = `A + B`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with single quoted string', () => {
    const sql = `'A' + 'B'`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'A'",
              "type": "literal",
              "value": "A",
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "'B'",
              "type": "literal",
              "value": "B",
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with double quoted string', () => {
    const sql = `"A" + "B"`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": true,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('single expression with numbers', () => {
    const sql = `1 + 2`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('brackets', () => {
    const sql = `(1 + 2)`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "+",
            },
          ],
          "values": Array [
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "1",
              "type": "literal",
              "value": 1,
            },
            SqlLiteral {
              "keywords": Object {},
              "parens": undefined,
              "spacing": Object {},
              "stringValue": "2",
              "type": "literal",
              "value": 2,
            },
          ],
        },
        "keywords": Object {},
        "op": "+",
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Decimal', () => {
    const sql = `COUNT(*) * 1.0 / COUNT(*)`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "*",
            },
          ],
          "values": Array [
            SqlFunction {
              "args": SeparatedArray {
                "separators": Array [],
                "values": Array [
                  SqlStar {
                    "keywords": Object {},
                    "parens": undefined,
                    "spacing": Object {},
                    "table": undefined,
                    "type": "star",
                  },
                ],
              },
              "decorator": undefined,
              "extendClause": undefined,
              "functionName": RefName {
                "name": "COUNT",
                "quotes": false,
              },
              "keywords": Object {},
              "namespace": undefined,
              "parens": undefined,
              "spacing": Object {
                "postArguments": "",
                "postLeftParen": "",
                "preLeftParen": "",
              },
              "specialParen": undefined,
              "type": "function",
              "whereClause": undefined,
              "windowSpec": undefined,
            },
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "/",
                  },
                ],
                "values": Array [
                  SqlLiteral {
                    "keywords": Object {},
                    "parens": undefined,
                    "spacing": Object {},
                    "stringValue": "1.0",
                    "type": "literal",
                    "value": 1,
                  },
                  SqlFunction {
                    "args": SeparatedArray {
                      "separators": Array [],
                      "values": Array [
                        SqlStar {
                          "keywords": Object {},
                          "parens": undefined,
                          "spacing": Object {},
                          "table": undefined,
                          "type": "star",
                        },
                      ],
                    },
                    "decorator": undefined,
                    "extendClause": undefined,
                    "functionName": RefName {
                      "name": "COUNT",
                      "quotes": false,
                    },
                    "keywords": Object {},
                    "namespace": undefined,
                    "parens": undefined,
                    "spacing": Object {
                      "postArguments": "",
                      "postLeftParen": "",
                      "preLeftParen": "",
                    },
                    "specialParen": undefined,
                    "type": "function",
                    "whereClause": undefined,
                    "windowSpec": undefined,
                  },
                ],
              },
              "keywords": Object {},
              "op": "/",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
          ],
        },
        "keywords": Object {},
        "op": "*",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});

describe('Combined expression', () => {
  it('Every expression', () => {
    const sql = `A OR B AND C > D + E`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "B",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlComparison {
                    "decorator": undefined,
                    "keywords": Object {
                      "op": ">",
                    },
                    "lhs": SqlColumn {
                      "keywords": Object {},
                      "parens": undefined,
                      "refName": RefName {
                        "name": "C",
                        "quotes": false,
                      },
                      "spacing": Object {},
                      "table": undefined,
                      "type": "column",
                    },
                    "op": ">",
                    "parens": undefined,
                    "rhs": SqlMulti {
                      "args": SeparatedArray {
                        "separators": Array [
                          Separator {
                            "left": " ",
                            "right": " ",
                            "separator": "+",
                          },
                        ],
                        "values": Array [
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "D",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "E",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                        ],
                      },
                      "keywords": Object {},
                      "op": "+",
                      "parens": undefined,
                      "spacing": Object {},
                      "type": "multi",
                    },
                    "spacing": Object {
                      "postOp": " ",
                      "preOp": " ",
                    },
                    "type": "comparison",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Every expression out of order', () => {
    const sql = `A + B > C AND D OR E`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlComparison {
                    "decorator": undefined,
                    "keywords": Object {
                      "op": ">",
                    },
                    "lhs": SqlMulti {
                      "args": SeparatedArray {
                        "separators": Array [
                          Separator {
                            "left": " ",
                            "right": " ",
                            "separator": "+",
                          },
                        ],
                        "values": Array [
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "A",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "B",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                        ],
                      },
                      "keywords": Object {},
                      "op": "+",
                      "parens": undefined,
                      "spacing": Object {},
                      "type": "multi",
                    },
                    "op": ">",
                    "parens": undefined,
                    "rhs": SqlColumn {
                      "keywords": Object {},
                      "parens": undefined,
                      "refName": RefName {
                        "name": "C",
                        "quotes": false,
                      },
                      "spacing": Object {},
                      "table": undefined,
                      "type": "column",
                    },
                    "spacing": Object {
                      "postOp": " ",
                      "preOp": " ",
                    },
                    "type": "comparison",
                  },
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "D",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "E",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Every expression out of order', () => {
    const sql = `A AND B > C + D OR E`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "A",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlComparison {
                    "decorator": undefined,
                    "keywords": Object {
                      "op": ">",
                    },
                    "lhs": SqlColumn {
                      "keywords": Object {},
                      "parens": undefined,
                      "refName": RefName {
                        "name": "B",
                        "quotes": false,
                      },
                      "spacing": Object {},
                      "table": undefined,
                      "type": "column",
                    },
                    "op": ">",
                    "parens": undefined,
                    "rhs": SqlMulti {
                      "args": SeparatedArray {
                        "separators": Array [
                          Separator {
                            "left": " ",
                            "right": " ",
                            "separator": "+",
                          },
                        ],
                        "values": Array [
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "C",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                          SqlColumn {
                            "keywords": Object {},
                            "parens": undefined,
                            "refName": RefName {
                              "name": "D",
                              "quotes": false,
                            },
                            "spacing": Object {},
                            "table": undefined,
                            "type": "column",
                          },
                        ],
                      },
                      "keywords": Object {},
                      "op": "+",
                      "parens": undefined,
                      "spacing": Object {},
                      "type": "multi",
                    },
                    "spacing": Object {
                      "postOp": " ",
                      "preOp": " ",
                    },
                    "type": "comparison",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "E",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});

describe('Multiple expressions', () => {
  it('Multiple Or ', () => {
    const sql = `A OR B OR C`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "C",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('Multiple ANDs and ORs', () => {
    const sql = `A AND B OR C AND D OR E`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "A",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "B",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "C",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "D",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": undefined,
              "spacing": Object {},
              "type": "multi",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "E",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});

describe('Brackets', () => {
  it('Changing order of operations', () => {
    const sql = `(A AND b) OR c`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "AND",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "A",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "b",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                ],
              },
              "keywords": Object {},
              "op": "AND",
              "parens": Array [
                Object {
                  "leftSpacing": "",
                  "rightSpacing": "",
                },
              ],
              "spacing": Object {},
              "type": "multi",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "c",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);

    backAndForth(sql);
  });

  it('Wrapping Expression', () => {
    const sql = `((A + b) OR c)`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlMulti {
              "args": SeparatedArray {
                "separators": Array [
                  Separator {
                    "left": " ",
                    "right": " ",
                    "separator": "+",
                  },
                ],
                "values": Array [
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "A",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                  SqlColumn {
                    "keywords": Object {},
                    "parens": undefined,
                    "refName": RefName {
                      "name": "b",
                      "quotes": false,
                    },
                    "spacing": Object {},
                    "table": undefined,
                    "type": "column",
                  },
                ],
              },
              "keywords": Object {},
              "op": "+",
              "parens": Array [
                Object {
                  "leftSpacing": "",
                  "rightSpacing": "",
                },
              ],
              "spacing": Object {},
              "type": "multi",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "c",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "spacing": Object {},
        "type": "multi",
      }
    `);

    backAndForth(sql);
  });

  it('Changing order of operations', () => {
    const sql = `NOT NOT (A + b) OR c`;

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "OR",
            },
          ],
          "values": Array [
            SqlUnary {
              "argument": SqlUnary {
                "argument": SqlMulti {
                  "args": SeparatedArray {
                    "separators": Array [
                      Separator {
                        "left": " ",
                        "right": " ",
                        "separator": "+",
                      },
                    ],
                    "values": Array [
                      SqlColumn {
                        "keywords": Object {},
                        "parens": undefined,
                        "refName": RefName {
                          "name": "A",
                          "quotes": false,
                        },
                        "spacing": Object {},
                        "table": undefined,
                        "type": "column",
                      },
                      SqlColumn {
                        "keywords": Object {},
                        "parens": undefined,
                        "refName": RefName {
                          "name": "b",
                          "quotes": false,
                        },
                        "spacing": Object {},
                        "table": undefined,
                        "type": "column",
                      },
                    ],
                  },
                  "keywords": Object {},
                  "op": "+",
                  "parens": Array [
                    Object {
                      "leftSpacing": "",
                      "rightSpacing": "",
                    },
                  ],
                  "spacing": Object {},
                  "type": "multi",
                },
                "keywords": Object {
                  "op": "NOT",
                },
                "op": "NOT",
                "parens": undefined,
                "spacing": Object {
                  "postOp": " ",
                },
                "type": "unary",
              },
              "keywords": Object {
                "op": "NOT",
              },
              "op": "NOT",
              "parens": undefined,
              "spacing": Object {
                "postOp": " ",
              },
              "type": "unary",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "c",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "OR",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);

    backAndForth(sql);
  });
});

describe('containsColumn', () => {
  it('nested expression', () => {
    const sql = `A > 1 AND D OR B OR C`;

    expect(SqlExpression.parse(sql).containsColumnName('A')).toEqual(true);
  });

  it('nested expression with brackets', () => {
    const sql = `(A + B ) > 1 AND D OR B OR C`;

    expect(SqlExpression.parse(sql).containsColumnName('A')).toEqual(true);
  });

  it('nested expression with brackets', () => {
    const sql = `(D + B ) > 1 AND D OR B OR C`;

    expect(SqlExpression.parse(sql).containsColumnName('A')).toEqual(false);
  });
});

describe('getColumns', () => {
  it('Only multi expressions', () => {
    const sql = `A > 1 AND D OR B OR C`;

    expect(SqlExpression.parse(sql).getColumns()).toMatchInlineSnapshot(`
      Array [
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "A",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "D",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "B",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "C",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
      ]
    `);
  });

  it('includes unary expressions', () => {
    const sql = `A > 1 AND D OR B OR Not C`;

    expect(SqlExpression.parse(sql).getColumns()).toMatchInlineSnapshot(`
      Array [
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "A",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "D",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "B",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "C",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
      ]
    `);
  });

  it('includes unary expressions and nested Multi Expressions', () => {
    const sql = `A > 1 AND D OR B OR Not (C Or E)`;

    expect(SqlExpression.parse(sql).getColumns()).toMatchInlineSnapshot(`
      Array [
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "A",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "D",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "B",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "C",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "E",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
      ]
    `);
  });

  it('Concat function', () => {
    const sql = `A || B || C`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "||",
            },
            Separator {
              "left": " ",
              "right": " ",
              "separator": "||",
            },
          ],
          "values": Array [
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "A",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "B",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
            SqlColumn {
              "keywords": Object {},
              "parens": undefined,
              "refName": RefName {
                "name": "C",
                "quotes": false,
              },
              "spacing": Object {},
              "table": undefined,
              "type": "column",
            },
          ],
        },
        "keywords": Object {},
        "op": "||",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });

  it('IS function', () => {
    const sql = `X IS NULL`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlComparison {
        "decorator": undefined,
        "keywords": Object {
          "op": "IS",
        },
        "lhs": SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "X",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        "op": "IS",
        "parens": undefined,
        "rhs": SqlLiteral {
          "keywords": Object {},
          "parens": undefined,
          "spacing": Object {},
          "stringValue": "NULL",
          "type": "literal",
          "value": null,
        },
        "spacing": Object {
          "postOp": " ",
          "preOp": " ",
        },
        "type": "comparison",
      }
    `);
  });

  it('IS NOT NULL', () => {
    const sql = `X IS NOT NULL`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlComparison {
        "decorator": undefined,
        "keywords": Object {
          "op": "IS NOT",
        },
        "lhs": SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "X",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        "op": "IS NOT",
        "parens": undefined,
        "rhs": SqlLiteral {
          "keywords": Object {},
          "parens": undefined,
          "spacing": Object {},
          "stringValue": "NULL",
          "type": "literal",
          "value": null,
        },
        "spacing": Object {
          "postOp": " ",
          "preOp": " ",
        },
        "type": "comparison",
      }
    `);
  });

  it('IS NOT TRUE', () => {
    const sql = `X IS NOT TRUE`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlComparison {
        "decorator": undefined,
        "keywords": Object {
          "op": "IS NOT",
        },
        "lhs": SqlColumn {
          "keywords": Object {},
          "parens": undefined,
          "refName": RefName {
            "name": "X",
            "quotes": false,
          },
          "spacing": Object {},
          "table": undefined,
          "type": "column",
        },
        "op": "IS NOT",
        "parens": undefined,
        "rhs": SqlLiteral {
          "keywords": Object {},
          "parens": undefined,
          "spacing": Object {},
          "stringValue": "TRUE",
          "type": "literal",
          "value": true,
        },
        "spacing": Object {
          "postOp": " ",
          "preOp": " ",
        },
        "type": "comparison",
      }
    `);
  });

  it('Nested IS Not function', () => {
    const sql = `X IS NOT NULL AND X <> ''`;

    backAndForth(sql);

    expect(SqlExpression.parse(sql)).toMatchInlineSnapshot(`
      SqlMulti {
        "args": SeparatedArray {
          "separators": Array [
            Separator {
              "left": " ",
              "right": " ",
              "separator": "AND",
            },
          ],
          "values": Array [
            SqlComparison {
              "decorator": undefined,
              "keywords": Object {
                "op": "IS NOT",
              },
              "lhs": SqlColumn {
                "keywords": Object {},
                "parens": undefined,
                "refName": RefName {
                  "name": "X",
                  "quotes": false,
                },
                "spacing": Object {},
                "table": undefined,
                "type": "column",
              },
              "op": "IS NOT",
              "parens": undefined,
              "rhs": SqlLiteral {
                "keywords": Object {},
                "parens": undefined,
                "spacing": Object {},
                "stringValue": "NULL",
                "type": "literal",
                "value": null,
              },
              "spacing": Object {
                "postOp": " ",
                "preOp": " ",
              },
              "type": "comparison",
            },
            SqlComparison {
              "decorator": undefined,
              "keywords": Object {
                "op": "<>",
              },
              "lhs": SqlColumn {
                "keywords": Object {},
                "parens": undefined,
                "refName": RefName {
                  "name": "X",
                  "quotes": false,
                },
                "spacing": Object {},
                "table": undefined,
                "type": "column",
              },
              "op": "<>",
              "parens": undefined,
              "rhs": SqlLiteral {
                "keywords": Object {},
                "parens": undefined,
                "spacing": Object {},
                "stringValue": "''",
                "type": "literal",
                "value": "",
              },
              "spacing": Object {
                "postOp": " ",
                "preOp": " ",
              },
              "type": "comparison",
            },
          ],
        },
        "keywords": Object {},
        "op": "AND",
        "parens": undefined,
        "spacing": Object {},
        "type": "multi",
      }
    `);
  });
});
