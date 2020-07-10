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

import { SqlBase, SqlBaseValue, Substitutor } from '../../sql-base';
import { SqlLiteral } from '../../sql-expression';

export interface SqlLimitClauseValue extends SqlBaseValue {
  keyword?: string;
  limit: SqlLiteral;
}

export class SqlLimitClause extends SqlBase {
  static type = 'limitClause';

  static DEFAULT_KEYWORD = 'LIMIT';

  static create(limit: SqlLiteral | number): SqlLimitClause {
    return new SqlLimitClause({
      limit: SqlLiteral.create(limit),
    });
  }

  public readonly keyword?: string;
  public readonly limit: SqlLiteral;

  constructor(options: SqlLimitClauseValue) {
    super(options, SqlLimitClause.type);
    this.keyword = options.keyword;
    this.limit = options.limit;
  }

  public valueOf(): SqlLimitClauseValue {
    const value = super.valueOf() as SqlLimitClauseValue;
    value.keyword = this.keyword;
    value.limit = this.limit;
    return value;
  }

  protected _toRawString(): string {
    const rawParts: string[] = [
      this.keyword || SqlLimitClause.DEFAULT_KEYWORD,
      this.getInnerSpace('postKeyword'),
    ];

    rawParts.push(this.limit.toString());

    return rawParts.join('');
  }

  public changeKeyword(keyword: string | undefined): this {
    const value = this.valueOf();
    value.keyword = keyword;
    return SqlBase.fromValue(value);
  }

  public changeLimit(limit: SqlLiteral | number): this {
    const value = this.valueOf();
    value.limit = SqlLiteral.create(limit);
    return SqlBase.fromValue(value);
  }

  public _walkInner(
    nextStack: SqlBase[],
    fn: Substitutor,
    postorder: boolean,
  ): SqlBase | undefined {
    let ret = this;

    const limit = this.limit._walkHelper(nextStack, fn, postorder);
    if (!limit) return;
    if (limit !== this.limit) {
      ret = ret.changeLimit(limit as SqlLiteral);
    }

    return ret;
  }

  public clearStaticKeywords(): this {
    const value = this.valueOf();
    delete value.keyword;
    return SqlBase.fromValue(value);
  }
}

SqlBase.register(SqlLimitClause.type, SqlLimitClause);
