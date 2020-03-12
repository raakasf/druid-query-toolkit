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

import { sqlParserFactory } from '../../index';
import { FUNCTIONS } from '../../test-utils';

const parser = sqlParserFactory(FUNCTIONS);

describe('Case expression', () => {
  it('simple CASE Expression', () => {
    const sql = `CASE A WHEN B THEN C END`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(`"CASE A WHEN B THEN C END"`);
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": undefined,
        "elseKeyword": undefined,
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": " ",
          "postCaseExpression": " ",
          "postElse": "",
          "postWhenThen": "",
          "preEnd": " ",
        },
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": " ",
            "thenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "C",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "B",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });

  it('simple CASE Expression with ELSE', () => {
    const sql = `CASE A WHEN B THEN C ELSE D END`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(`"CASE A WHEN B THEN C ELSE D END"`);
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "D",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "elseKeyword": "ELSE",
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": " ",
          "postCaseExpression": " ",
          "postElse": " ",
          "postWhenThen": " ",
          "preEnd": " ",
        },
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": " ",
            "thenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "C",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "B",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });

  it('simple CASE Expression with weird spacing', () => {
    const sql = `CASE A  WHEN     B THEN C      END`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(`"CASE A  WHEN     B THEN C      END"`);
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": undefined,
        "elseKeyword": undefined,
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": " ",
          "postCaseExpression": "  ",
          "postElse": "",
          "postWhenThen": "",
          "preEnd": "      ",
        },
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": "     ",
            "thenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "C",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "B",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });

  it('simple CASE Expression with brackets', () => {
    const sql = `(CASE A WHEN B THEN C END)`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(`"(CASE A WHEN B THEN C END)"`);
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": undefined,
        "elseKeyword": undefined,
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": " ",
          "postCaseExpression": " ",
          "postElse": "",
          "postWhenThen": "",
          "preEnd": " ",
        },
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": " ",
            "thenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "C",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "B",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });

  it('simple CASE Expression with brackets and weird spacing', () => {
    const sql = `(   CASE   A WHEN   B THEN C END  )`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(`"(   CASE   A WHEN   B THEN C END  )"`);
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": undefined,
        "elseKeyword": undefined,
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": "   ",
          "postCaseExpression": " ",
          "postElse": "",
          "postWhenThen": "",
          "preEnd": " ",
        },
        "parens": Array [
          Object {
            "leftSpacing": "   ",
            "rightSpacing": "  ",
          },
        ],
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": "   ",
            "thenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "C",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlRef {
              "innerSpacing": Object {},
              "name": "B",
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "type": "ref",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });

  it('simple CASE Expression with complex expressions', () => {
    const sql = `(   CASE   A WHEN  B AND B THEN C OR C END  )`;

    expect(parser(sql).toString()).toMatchInlineSnapshot(
      `"(   CASE   A WHEN  B AND B THEN C OR C END  )"`,
    );
    expect(parser(sql)).toMatchInlineSnapshot(`
      SqlCaseSimple {
        "caseExpression": SqlRef {
          "innerSpacing": Object {},
          "name": "A",
          "namespace": undefined,
          "namespaceQuotes": undefined,
          "quotes": "",
          "type": "ref",
        },
        "caseKeyword": "CASE",
        "elseExpression": undefined,
        "elseKeyword": undefined,
        "endKeyword": "END",
        "innerSpacing": Object {
          "postCase": "   ",
          "postCaseExpression": " ",
          "postElse": "",
          "postWhenThen": "",
          "preEnd": " ",
        },
        "parens": Array [
          Object {
            "leftSpacing": "   ",
            "rightSpacing": "  ",
          },
        ],
        "postWhenThenUnits": Array [],
        "type": "caseSimple",
        "whenThenUnits": Array [
          Object {
            "postThenSpace": " ",
            "postWhenExpressionSpace": " ",
            "postWhenSpace": "  ",
            "thenExpression": SqlMulti {
              "arguments": Array [
                SqlRef {
                  "innerSpacing": Object {},
                  "name": "C",
                  "namespace": undefined,
                  "namespaceQuotes": undefined,
                  "quotes": "",
                  "type": "ref",
                },
                SqlRef {
                  "innerSpacing": Object {},
                  "name": "C",
                  "namespace": undefined,
                  "namespaceQuotes": undefined,
                  "quotes": "",
                  "type": "ref",
                },
              ],
              "expressionType": "OR",
              "innerSpacing": Object {},
              "separators": Array [
                Separator {
                  "left": " ",
                  "right": " ",
                  "separator": "OR",
                },
              ],
              "type": "multi",
            },
            "thenKeyword": "THEN",
            "whenExpression": SqlMulti {
              "arguments": Array [
                SqlRef {
                  "innerSpacing": Object {},
                  "name": "B",
                  "namespace": undefined,
                  "namespaceQuotes": undefined,
                  "quotes": "",
                  "type": "ref",
                },
                SqlRef {
                  "innerSpacing": Object {},
                  "name": "B",
                  "namespace": undefined,
                  "namespaceQuotes": undefined,
                  "quotes": "",
                  "type": "ref",
                },
              ],
              "expressionType": "AND",
              "innerSpacing": Object {},
              "separators": Array [
                Separator {
                  "left": " ",
                  "right": " ",
                  "separator": "AND",
                },
              ],
              "type": "multi",
            },
            "whenKeyword": "WHEN",
          },
        ],
      }
    `);
  });
});