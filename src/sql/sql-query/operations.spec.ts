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

import { parseSql, parseSqlQuery, SqlAliasRef, SqlFunction, SqlRef } from '../..';
import { sane } from '../../test-utils';

describe('getTableName Tests', () => {
  it('getTableNames', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM "github"`).getTableName(),
    ).toMatchInlineSnapshot(`"github"`);
  });

  it('getTableName with nameSpace', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github"`).getTableName(),
    ).toMatchInlineSnapshot(`"github"`);
  });

  it('getTableName with nameSpace and alias', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" as Name`).getTableName(),
    ).toMatchInlineSnapshot(`"Name"`);
  });

  it('getTableName with multiple tables', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" as test, sys.name`).getTableName(),
    ).toMatchInlineSnapshot(`"test"`);
  });
});

describe('getSchema Test', () => {
  it('getSchema', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github"`).getSchema(),
    ).toMatchInlineSnapshot(`"sys"`);
  });

  it('getSchema from SqlRef with no nameSpace', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM "github"`).getSchema(),
    ).toMatchInlineSnapshot(`undefined`);
  });

  it('getSchema from multiple tables', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github", "table"`).getSchema(),
    ).toMatchInlineSnapshot(`"sys"`);
  });
});

describe('getSorted Test', () => {
  it('getSorted', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" ORDER BY column DESC`).getSorted(),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "desc": true,
          "id": "column",
        },
      ]
    `);
  });

  it('getSorted with undefined direction', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" ORDER BY column`).getSorted(),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "desc": true,
          "id": "column",
        },
      ]
    `);
  });

  it('getSorted with multiple columns', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" ORDER BY column, columnTwo ASC`).getSorted(),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "desc": true,
          "id": "column",
        },
        Object {
          "desc": false,
          "id": "columnTwo",
        },
      ]
    `);
  });

  it('getSorted with numbered column', () => {
    expect(
      parseSqlQuery(`SELECT column, columnTwo 
  FROM sys."github" ORDER BY 1 ASC`).getSorted(),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "desc": false,
          "id": "column",
        },
      ]
    `);
  });
});

describe('order by Test', () => {
  it('noo order by clause', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github"`)
        .orderBy('column', 'DESC')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\"
      ORDER BY \\"column\\" DESC"
    `);
  });

  it('add to order by clause', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" ORDER BY column`)
        .orderBy('columnTwo', 'DESC')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\" ORDER BY column, \\"columnTwo\\" DESC"
    `);
  });

  it('order by with out direction', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" ORDER BY column, columnTwo ASC`)
        .orderBy('columnThree')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\" ORDER BY column, columnTwo ASC, \\"columnThree\\""
    `);
  });
});

describe('addWhereFilter test ', () => {
  it('no Where filter', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github"`)
        .addWhereFilter('column', '>', 1)
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\"
      WHERE \\"column\\" > 1"
    `);
  });

  it('Single Where filter value', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" WHERE column > 1`)
        .addWhereFilter('columnTwo', '>', 2)
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\" WHERE column > 1 AND \\"columnTwo\\" > 2"
    `);
  });

  it('OR Where filter value', () => {
    expect(
      parseSqlQuery(`SELECT *
  FROM sys."github" WHERE column > 1 OR column < 5`)
        .addWhereFilter('columnTwo', '>', 2)
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
        FROM sys.\\"github\\" WHERE (column > 1 OR column < 5) AND \\"columnTwo\\" > 2"
    `);
  });

  it('AND Where filter value', () => {
    expect(
      parseSqlQuery(`SELECT *
        FROM sys."github" WHERE (column > 1 OR column < 5) AND columnTwo > 5`)
        .addWhereFilter('columnTwo', '>', 2)
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT *
              FROM sys.\\"github\\" WHERE (column > 1 OR column < 5) AND \\"columnTwo\\" > 2"
    `);
  });
});

describe('remove functions', () => {
  it('remove first column from select', () => {
    expect(
      parseSqlQuery(`SELECT column, column1
  FROM sys."github"`)
        .removeFromSelect('column')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column1
        FROM sys.\\"github\\""
    `);
  });

  it('remove middle column from select', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"`)
        .removeFromSelect('column1')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove end column from select', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"`)
        .removeFromSelect('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1
        FROM sys.\\"github\\""
    `);
  });

  it('remove column from where', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column AND column2`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Where column"
    `);
  });

  it('remove only column from where', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column2 = '1'`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove multiple filters for the same column', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column2 > '1' AND column2 < '1'`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove multiple filters for the same column', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column2 > '1' AND column1 > 2 OR column2 < '1'`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Where column1 > 2"
    `);
  });

  it('remove only comparison expression from where', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column2 > 1`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove only comparison expression from where', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Where column2 > 1 AND column1 > 1`)
        .removeFromWhere('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Where column1 > 1"
    `);
  });

  it('remove only column from having', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Having column2 > 1`)
        .removeFromHaving('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove only comparison expression from having', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Having column2 > 1`)
        .removeFromHaving('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove only comparison expression from having', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Having column2 > 1 AND column1 > 1`)
        .removeFromHaving('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Having column1 > 1"
    `);
  });

  it('remove one numbered column from order by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Order By column, 2 ASC`)
        .removeFromOrderBy('column')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Order By 2 ASC"
    `);
  });

  it('remove column not in order by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Order By column, column1 ASC`)
        .removeFromOrderBy('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Order By column, column1 ASC"
    `);
  });

  it('remove one numbered column not in order by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Order By column, 3 ASC`)
        .removeFromOrderBy('column1')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Order By column, 3 ASC"
    `);
  });

  it('remove only column in order by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Order By column1`)
        .removeFromOrderBy('column1')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });

  it('remove column from group by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Group By column, 3`)
        .removeFromGroupBy('column')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Group By 3"
    `);
  });

  it('remove column as number from group by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Group By column, 3`)
        .removeFromGroupBy('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\"
        Group By column"
    `);
  });

  it('remove only column from group by', () => {
    expect(
      parseSqlQuery(`SELECT column, column1, column2
  FROM sys."github"
  Group By column2`)
        .removeFromGroupBy('column2')
        .toString(),
    ).toMatchInlineSnapshot(`
      "SELECT column, column1, column2
        FROM sys.\\"github\\""
    `);
  });
});

describe('getAggregateColumns', () => {
  it('get all aggregate columns', () => {
    const sql = sane`
      SELECT column, SUM(column1) As aggregated, column2
      FROM sys."github"
      Group By column2
    `;

    expect(parseSqlQuery(sql).getAggregateColumns()).toMatchInlineSnapshot(`
      Array [
        "column",
        "aggregated",
      ]
    `);
  });

  it('get all aggregate columns using numbers', () => {
    const sql = sane`
      SELECT column, SUM(column1) As aggregated, column2
      FROM sys."github"
      Group By column2,  1, 3
    `;

    expect(parseSqlQuery(sql).getAggregateColumns()).toMatchInlineSnapshot(`
      Array [
        "aggregated",
      ]
    `);
  });
});

describe('getCurrentFilters', () => {
  it('get all filters, only having clause', () => {
    const sql = sane`
      SELECT column, SUM(column1) As aggregated, column2
      FROM sys."github"
      Group By column2
      Having column > 1 AND aggregated < 100
    `;

    expect(parseSqlQuery(sql).getCurrentFilters()).toMatchInlineSnapshot(`
      Array [
        "column",
        "aggregated",
      ]
    `);
  });

  it('get all filters, only where clause', () => {
    const sql = sane`
      SELECT column, SUM(column1) As aggregated, column2
      FROM sys."github"
      Where column > 1 AND aggregated < 100
      Group By column2
    `;

    expect(parseSqlQuery(sql).getCurrentFilters()).toMatchInlineSnapshot(`
      Array [
        "column",
        "aggregated",
      ]
    `);
  });

  it('get all filters, where and having clauses', () => {
    const sql = sane`
      SELECT column, SUM(column1) As aggregated, column2
      FROM sys."github"
      Where column > 1 AND aggregated < 100
      Group By column2
      Having column3 > 1 AND column4 < 100
    `;

    expect(parseSqlQuery(sql).getCurrentFilters()).toMatchInlineSnapshot(`
      Array [
        "column3",
        "column4",
        "column",
        "aggregated",
      ]
    `);
  });
});

describe('addAggregateColumn', () => {
  it('single column', () => {
    const sql = 'select column1 from table';

    expect(
      parseSqlQuery(sql)
        .addAggregateColumn([SqlRef.fromString('column2')], 'min', 'alias')
        .toString(),
    ).toMatchInlineSnapshot(`"select column1, min(column2) AS \\"alias\\" from table"`);
  });

  it('function with decorator', () => {
    const sql = 'select column1 from table';

    expect(
      parseSqlQuery(sql)
        .addAggregateColumn([SqlRef.fromString('column2')], 'min', 'alias', undefined, 'DISTINCT')
        .toString(),
    ).toMatchInlineSnapshot(`"select column1, min(DISTINCT column2) AS \\"alias\\" from table"`);
  });
});

describe('addToGroupBy', () => {
  it('add simple column to group by', () => {
    const sql = 'select Count(*) from table';

    expect(
      parseSqlQuery(sql)
        .addToGroupBy(SqlRef.fromStringWithDoubleQuotes('column'))
        .toString(),
    ).toMatchInlineSnapshot(`
      "select \\"column\\", Count(*) from table
      GROUP BY 1"
    `);
  });

  it('no existing column', () => {
    const sql = 'select column1 from table';

    expect(
      parseSqlQuery(sql)
        .addToGroupBy(
          SqlAliasRef.sqlAliasFactory(
            SqlFunction.sqlFunctionFactory('min', [SqlRef.fromString('column1')]),
            'MinColumn',
          ),
        )
        .toString(),
    ).toMatchInlineSnapshot(`
      "select min(column1) AS \\"MinColumn\\", column1 from table
      GROUP BY 1"
    `);
  });

  it('existing columns in group by', () => {
    const sql = sane`
      select column1, min(column1) AS aliasName
      from table 
      GROUP BY 2
    `;

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlQuery {
        "explainKeyword": undefined,
        "fromKeyword": "from",
        "groupByExpression": Array [
          SqlLiteral {
            "innerSpacing": Object {},
            "keyword": undefined,
            "stringValue": "2",
            "type": "literal",
            "value": 2,
          },
        ],
        "groupByExpressionSeparators": Array [],
        "groupByKeyword": "GROUP BY",
        "havingExpression": undefined,
        "havingKeyword": undefined,
        "innerSpacing": Object {
          "postFrom": " ",
          "postGroupByKeyword": " ",
          "postQuery": "",
          "postSelect": " ",
          "postSelectDecorator": "",
          "preFrom": "
      ",
          "preGroupByKeyword": " 
      ",
          "preQuery": "",
        },
        "joinKeyword": undefined,
        "joinTable": undefined,
        "joinType": undefined,
        "limitKeyword": undefined,
        "limitValue": undefined,
        "onExpression": undefined,
        "onKeyword": undefined,
        "orderByKeyword": undefined,
        "orderBySeparators": undefined,
        "orderByUnits": undefined,
        "postQueryAnnotation": Array [],
        "selectAnnotations": Array [
          null,
          null,
        ],
        "selectDecorator": "",
        "selectKeyword": "select",
        "selectSeparators": Array [
          Separator {
            "left": "",
            "right": " ",
            "separator": ",",
          },
        ],
        "selectValues": Array [
          SqlRef {
            "column": "column1",
            "innerSpacing": Object {},
            "namespace": undefined,
            "namespaceQuotes": undefined,
            "quotes": "",
            "table": undefined,
            "tableQuotes": undefined,
            "type": "ref",
          },
          SqlAliasRef {
            "alias": SqlRef {
              "column": "aliasName",
              "innerSpacing": Object {},
              "namespace": undefined,
              "namespaceQuotes": undefined,
              "quotes": "",
              "table": undefined,
              "tableQuotes": undefined,
              "type": "ref",
            },
            "asKeyword": "AS",
            "column": SqlFunction {
              "arguments": Array [
                SqlRef {
                  "column": "column1",
                  "innerSpacing": Object {},
                  "namespace": undefined,
                  "namespaceQuotes": undefined,
                  "quotes": "",
                  "table": undefined,
                  "tableQuotes": undefined,
                  "type": "ref",
                },
              ],
              "decorator": undefined,
              "filterKeyword": undefined,
              "functionName": "min",
              "innerSpacing": Object {
                "postDecorator": "",
                "postFilterKeyword": "",
                "postFilterLeftParen": "",
                "postLeftParen": "",
                "postName": "",
                "postWhereKeyword": "",
                "preFilter": "",
                "preFilterRightParen": "",
                "preRightParen": "",
              },
              "separators": Array [],
              "type": "function",
              "whereExpression": undefined,
              "whereKeyword": undefined,
            },
            "innerSpacing": Object {
              "postAs": " ",
            },
            "postColumn": " ",
            "type": "alias-ref",
          },
        ],
        "tableSeparators": Array [],
        "tables": Array [
          SqlRef {
            "column": undefined,
            "innerSpacing": Object {
              "postTable": "",
              "preTable": "",
            },
            "namespace": undefined,
            "namespaceQuotes": undefined,
            "quotes": undefined,
            "table": "table",
            "tableQuotes": "",
            "type": "ref",
          },
        ],
        "type": "query",
        "unionKeyword": undefined,
        "unionQuery": undefined,
        "whereExpression": undefined,
        "whereKeyword": undefined,
        "withKeyword": undefined,
        "withSeparators": undefined,
        "withUnits": undefined,
      }
    `);
    expect(
      parseSqlQuery(sql)
        .addToGroupBy(
          SqlAliasRef.sqlAliasFactory(
            SqlFunction.sqlFunctionFactory('max', [SqlRef.fromString('column2')]),
            'MaxColumn',
          ),
        )
        .toString(),
    ).toMatchInlineSnapshot(`
      "select max(column2) AS \\"MaxColumn\\", column1, min(column1) AS aliasName
      from table 
      GROUP BY 1, 3"
    `);
  });
});
