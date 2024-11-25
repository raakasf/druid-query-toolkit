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

import type { SqlTypeDesignator, Substitutor } from '../../sql-base';
import { SqlBase } from '../../sql-base';
import { SqlLiteral } from '../../sql-literal/sql-literal';
import type { SqlClauseValue } from '../sql-clause';
import { SqlClause } from '../sql-clause';

export interface SqlLimitClauseValue extends SqlClauseValue {
  limit: SqlLiteral;
}

export class SqlLimitClause extends SqlClause {
  static type: SqlTypeDesignator = 'limitClause';

  static DEFAULT_LIMIT_KEYWORD = 'LIMIT';

  static create(limit: SqlLiteral | number): SqlLimitClause {
    return new SqlLimitClause({
      limit: SqlLiteral.create(limit),
    });
  }

  public readonly limit: SqlLiteral;

  constructor(options: SqlLimitClauseValue) {
    super(options, SqlLimitClause.type);
    this.limit = options.limit;
  }

  public valueOf(): SqlLimitClauseValue {
    const value = super.valueOf() as SqlLimitClauseValue;
    value.limit = this.limit;
    return value;
  }

  protected _toRawString(): string {
    return [
      this.getKeyword('limit', SqlLimitClause.DEFAULT_LIMIT_KEYWORD),
      this.getSpace('postLimit'),
      this.limit.toString(),
    ].join('');
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
  ): SqlClause | undefined {
    let ret = this;

    const limit = this.limit._walkHelper(nextStack, fn, postorder);
    if (!limit) return;
    if (limit !== this.limit) {
      ret = ret.changeLimit(limit as SqlLiteral);
    }

    return ret;
  }

  public getLimitValue(): number {
    return this.limit.getNumberValue()!;
  }
}

SqlBase.register(SqlLimitClause);
