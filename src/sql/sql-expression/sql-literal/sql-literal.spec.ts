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

import { parseSql, parseSqlQuery, SqlLiteral } from '../../..';
import { backAndForth } from '../../../test-utils';

describe('SqlLiteral', () => {
  it('things that work', () => {
    const queries: string[] = [
      `NULL`,
      `TRUE`,
      `FALSE`,
      `'lol'`,
      `U&'hello'`,
      `_latin1'hello'`,
      `_UTF8'hello'`,
      `_l-1'hello'`,
      `_8l-1'hello'`,
    ];

    for (const sql of queries) {
      try {
        backAndForth(sql);
      } catch (e) {
        throw new Error(`problem with \`${sql}\`: ${e.message}`);
      }
    }
  });

  it('things that do not work', () => {
    const queries: string[] = [`__l-1'hello'`, `_-l-1'hello'`];

    for (const sql of queries) {
      let didNotError = false;
      try {
        parseSqlQuery(sql);
        didNotError = true;
      } catch {}
      if (didNotError) {
        throw new Error(`should not parse: ${sql}`);
      }
    }
  });

  it('Works with Null', () => {
    const sql = `NULL`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "NULL",
        "type": "literal",
        "value": null,
      }
    `);
  });

  it('Works with True', () => {
    const sql = `True`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "True",
        "type": "literal",
        "value": true,
      }
    `);
  });

  it('Works with False', () => {
    const sql = `FalsE`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "FalsE",
        "type": "literal",
        "value": false,
      }
    `);
  });

  it('string literal', () => {
    const sql = `'word'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "'word'",
        "type": "literal",
        "value": "word",
      }
    `);
  });

  it('all sorts of number literals', () => {
    const numbersToTest = [
      '0',
      '0.0',
      '0.01',
      '.1',
      '1',
      '01',
      '1.234',
      '+1',
      '-1',
      '5e2',
      '+5e+2',
      '-5E2',
      '-5E02',
      '-5e-2',
    ];

    for (const num in numbersToTest) {
      backAndForth(num);
      expect((parseSql(num) as SqlLiteral).value).toEqual(parseFloat(num));
    }
  });

  it('number literals', () => {
    const sql = `1`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "1",
        "type": "literal",
        "value": 1,
      }
    `);
  });

  it('number literal with brackets', () => {
    const sql = `(1)`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "stringValue": "1",
        "type": "literal",
        "value": 1,
      }
    `);
  });

  it('string literal with brackets', () => {
    const sql = `('word')`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "parens": Array [
          Object {
            "leftSpacing": "",
            "rightSpacing": "",
          },
        ],
        "stringValue": "'word'",
        "type": "literal",
        "value": "word",
      }
    `);
  });

  it('empty string literal', () => {
    const sql = `''`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "''",
        "type": "literal",
        "value": "",
      }
    `);
  });

  it('Decimal literal', () => {
    const sql = `1.01`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "1.01",
        "type": "literal",
        "value": 1.01,
      }
    `);
  });

  it('works with number', () => {
    const sql = `12345`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "12345",
        "type": "literal",
        "value": 12345,
      }
    `);
  });

  it('works with string', () => {
    const sql = `'hello'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "'hello'",
        "type": "literal",
        "value": "hello",
      }
    `);
  });

  it('works with unicode string 1', () => {
    const sql = `U&'fo\\00F6'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "U&'fo\\\\00F6'",
        "type": "literal",
        "value": "foö",
      }
    `);
  });

  it('works with unicode string 2', () => {
    const sql = `u&'fo\\00F6\\00F6'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "u&'fo\\\\00F6\\\\00F6'",
        "type": "literal",
        "value": "foöö",
      }
    `);
  });

  it('works with timestamp', () => {
    const sql = `TIMESTAMP '2020-02-25 00:00:00'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {
          "postKeyword": " ",
        },
        "keyword": "TIMESTAMP",
        "stringValue": "'2020-02-25 00:00:00'",
        "type": "literal",
        "value": 2020-02-25T00:00:00.000Z,
      }
    `);
  });

  it('works with date', () => {
    const sql = `DATE '2020-02-25'`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {
          "postKeyword": " ",
        },
        "keyword": "DATE",
        "stringValue": "'2020-02-25'",
        "type": "literal",
        "value": 2020-02-25T00:00:00.000Z,
      }
    `);
  });

  it('works with dynamic placeholder', () => {
    const sql = `?`;

    backAndForth(sql);

    expect(parseSql(sql)).toMatchInlineSnapshot(`
      SqlLiteral {
        "innerSpacing": Object {},
        "keyword": undefined,
        "stringValue": "?",
        "type": "literal",
        "value": "?",
      }
    `);
  });

  it('works with factory', () => {
    expect(SqlLiteral.factory(null).toString()).toEqual('NULL');
    expect(SqlLiteral.factory(false).toString()).toEqual('FALSE');
    expect(SqlLiteral.factory(true).toString()).toEqual('TRUE');
    expect(SqlLiteral.factory(1.2).toString()).toEqual('1.2');
    expect(SqlLiteral.factory(`hello`).toString()).toEqual(`'hello'`);
    expect(SqlLiteral.factory(`he'o`).toString()).toEqual(`'he''o'`);
    expect(SqlLiteral.factory(new Date('2020-01-02Z')).toString()).toEqual(
      `TIMESTAMP '2020-01-02'`,
    );
    expect(SqlLiteral.factory(new Date('2020-01-02T03:04:05Z')).toString()).toEqual(
      `TIMESTAMP '2020-01-02 03:04:05'`,
    );
  });
});
