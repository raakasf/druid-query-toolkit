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

import { backAndForth, sane } from '../../test-utils';
import { SqlBase } from '../sql-base';

import { SqlQuery } from './sql-query';

describe('Uber Query', () => {
  const query = sane`
    WITH temp_t1 AS (SELECT * FROM blah)
    SELECT
      col1 AS "Col1",
      CASE WHEN colA = 1 THEN 3 ELSE 4 END AS "SomeCase1",
      CASE colB WHEN 1 THEN 'One' WHEN 2 THEN 'Two' ELSE 'Other' END AS "SomeCase2",      
      EXTRACT(EPOCH FROM "time"),
      EXTRACT(MICROSECOND FROM "time"),
      EXTRACT(MILLISECOND FROM "time"),
      EXTRACT(SECOND FROM "time"),
      EXTRACT(MINUTE FROM "time"),
      EXTRACT(HOUR FROM "time"),
      EXTRACT(DAY FROM "time"),
      EXTRACT(DOW FROM "time"),
      EXTRACT(ISODOW FROM "time"),
      EXTRACT(DOY FROM "time"),
      EXTRACT(WEEK FROM "time"),
      EXTRACT(MONTH FROM "time"),
      EXTRACT(QUARTER FROM "time"),
      EXTRACT(YEAR FROM "time"),
      EXTRACT(ISOYEAR FROM "time"),
      EXTRACT(DECADE FROM "time"),
      EXTRACT(CENTURY FROM "time"),
      EXTRACT(MILLENNIUM FROM "time"),
      SUM(blah) FILTER (WHERE col2 = 'moon')
    FROM t1, t2 AS t2As
    LEFT JOIN t3 ON t1.col = t3.col
    FULL JOIN t4 
    WHERE col1 = ?
      AND col2 <> 'B'
      AND col3 < CURRENT_TIMESTAMP - INTERVAL '1' DAY
      AND col4 > 4
      AND col5 <= 3
      AND col6 >= 3
      AND NOT (col7 IS NULL OR col8 IS NOT NULL)
      AND col8 BETWEEN TIMESTAMP '2020-01-01' AND TIMESTAMP '2020-01-01 02:03:04'
      AND col9 BETWEEN SYMMETRIC TIMESTAMP '2020-01-01' AND TIMESTAMP '2020-01-01 02:03:04'
      AND col10 NOT BETWEEN SYMMETRIC TIMESTAMP '2020-01-01' AND TIMESTAMP '2020-01-01 02:03:04'
      AND col11 LIKE '%a%'
      AND col12 LIKE '%a%' ESCAPE 'a'
    GROUP BY 
      1,
      col7
    HAVING "Col1" = 'lol'
    ORDER BY COUNT(*) DESC, 1 ASC, 4    
    LIMIT 100
    OFFSET 5
  `;

  it('works back and forth', () => {
    try {
      backAndForth(query);
    } catch (e) {
      // @ts-ignore
      console.log(e);
      throw e;
    }
  });

  it('walk it all', () => {
    expect(
      SqlQuery.parse(query)
        .walkPostorder(t => SqlBase.fromValue(t.valueOf()))
        .toString(),
    ).toEqual(query);
  });

  it('clear static keywords', () => {
    expect(
      SqlQuery.parse(query)
        .walkPostorder(t => t.clearOwnStaticKeywords())
        .toString(),
    ).toEqual(query);
  });
});
