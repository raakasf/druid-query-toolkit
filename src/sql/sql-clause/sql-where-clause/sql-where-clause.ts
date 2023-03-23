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

import { SqlBase, SqlTypeDesignator, Substitutor } from '../../sql-base';
import { SqlExpression } from '../../sql-expression';
import { SqlClause, SqlClauseValue } from '../sql-clause';

export interface SqlWhereClauseValue extends SqlClauseValue {
  expression: SqlExpression;
}

export class SqlWhereClause extends SqlClause {
  static type: SqlTypeDesignator = 'whereClause';

  static DEFAULT_WHERE_KEYWORD = 'WHERE';

  static create(expression: SqlWhereClause | SqlExpression): SqlWhereClause {
    if (expression instanceof SqlWhereClause) return expression;
    return new SqlWhereClause({
      expression,
    });
  }

  static createForFunction(expression: SqlWhereClause | SqlExpression): SqlWhereClause {
    return SqlWhereClause.create(expression).addParens();
  }

  public readonly expression: SqlExpression;

  constructor(options: SqlWhereClauseValue) {
    super(options, SqlWhereClause.type);
    this.expression = options.expression;
  }

  public valueOf(): SqlWhereClauseValue {
    const value = super.valueOf() as SqlWhereClauseValue;
    value.expression = this.expression;
    return value;
  }

  protected _toRawString(): string {
    return [
      this.getKeyword('where', SqlWhereClause.DEFAULT_WHERE_KEYWORD),
      this.getSpace('postWhere'),
      this.expression.toString(),
    ].join('');
  }

  public changeExpression(expression: SqlExpression): this {
    const value = this.valueOf();
    value.expression = expression;
    return SqlBase.fromValue(value);
  }

  public _walkInner(
    nextStack: SqlBase[],
    fn: Substitutor,
    postorder: boolean,
  ): SqlClause | undefined {
    let ret = this;

    const expression = this.expression._walkHelper(nextStack, fn, postorder);
    if (!expression) return;
    if (expression !== this.expression) {
      ret = ret.changeExpression(expression);
    }

    return ret;
  }

  public removeColumnFromAnd(column: string): SqlWhereClause | undefined {
    const newExpression = this.expression.removeColumnFromAnd(column);
    if (!newExpression) return;
    return this.changeExpression(newExpression);
  }
}

SqlBase.register(SqlWhereClause);
