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

import { SqlAlias, SqlJoinPart } from '..';
import { filterMap } from '../../../utils';
import { SqlBase, SqlBaseValue, Substitutor } from '../../sql-base';
import { SqlRef } from '../../sql-expression';
import { SeparatedArray } from '../../utils';

export interface SqlFromClauseValue extends SqlBaseValue {
  keyword?: string;
  expressions: SeparatedArray<SqlAlias>;
  joinParts?: SeparatedArray<SqlJoinPart>;
}

export class SqlFromClause extends SqlBase {
  static type = 'fromClause';

  static DEFAULT_KEYWORD = 'FROM';

  static create(expressions: SeparatedArray<SqlAlias> | SqlAlias[]): SqlFromClause {
    return new SqlFromClause({
      expressions: SeparatedArray.fromArray(expressions),
    });
  }

  public readonly keyword?: string;
  public readonly expressions: SeparatedArray<SqlAlias>;
  public readonly joinParts?: SeparatedArray<SqlJoinPart>;

  constructor(options: SqlFromClauseValue) {
    super(options, SqlFromClause.type);
    this.keyword = options.keyword;
    this.expressions = options.expressions;
    this.joinParts = options.joinParts;
  }

  public valueOf(): SqlFromClauseValue {
    const value = super.valueOf() as SqlFromClauseValue;
    value.keyword = this.keyword;
    value.expressions = this.expressions;
    value.joinParts = this.joinParts;
    return value;
  }

  protected _toRawString(): string {
    const rawParts: string[] = [
      this.keyword || SqlFromClause.DEFAULT_KEYWORD,
      this.getInnerSpace('postKeyword'),
    ];

    rawParts.push(this.expressions.toString());

    if (this.joinParts) {
      rawParts.push(this.getInnerSpace('preJoin', '\n'), this.joinParts.toString('\n'));
    }

    return rawParts.join('');
  }

  public changeKeyword(keyword: string | undefined): this {
    const value = this.valueOf();
    value.keyword = keyword;
    return SqlBase.fromValue(value);
  }

  public changeExpressions(expressions: SeparatedArray<SqlAlias> | SqlAlias[]): this {
    const value = this.valueOf();
    value.expressions = SeparatedArray.fromArray(expressions);
    return SqlBase.fromValue(value);
  }

  public changeJoinParts(joinParts: SeparatedArray<SqlJoinPart> | SqlJoinPart[] | undefined): this {
    const value = this.valueOf();
    if (joinParts) {
      value.joinParts = SeparatedArray.fromArray(joinParts);
    } else {
      value.innerSpacing = this.getInnerSpacingWithout('preJoin');
      delete value.joinParts;
    }
    return SqlBase.fromValue(value);
  }

  public _walkInner(
    nextStack: SqlBase[],
    fn: Substitutor,
    postorder: boolean,
  ): SqlBase | undefined {
    let ret = this;

    const expressions = SqlBase.walkSeparatedArray(this.expressions, nextStack, fn, postorder);
    if (!expressions) return;
    if (expressions !== this.expressions) {
      ret = ret.changeExpressions(expressions);
    }

    if (this.joinParts) {
      const joinParts = SqlBase.walkSeparatedArray(this.joinParts, nextStack, fn, postorder);
      if (!joinParts) return;
      if (joinParts !== this.joinParts) {
        ret = ret.changeJoinParts(joinParts);
      }
    }

    return ret;
  }

  public clearStaticKeywords(): this {
    const value = this.valueOf();
    delete value.keyword;
    return SqlBase.fromValue(value);
  }

  public clearSeparators(): this {
    const value = this.valueOf();

    value.expressions = this.expressions.clearSeparators();

    if (this.joinParts) {
      value.joinParts = this.joinParts.clearSeparators();
    }

    return SqlBase.fromValue(value);
  }

  public getFirstTableName(): string {
    return filterMap(this.expressions.values, table => {
      const tableRef = table.expression;
      if (tableRef instanceof SqlRef) {
        return tableRef.table;
      }
      return;
    })[0];
  }

  public getFirstSchema(): string {
    return filterMap(this.expressions.values, table => {
      const tableRef = table.expression;
      if (tableRef instanceof SqlRef) {
        return tableRef.namespace;
      }
      return;
    })[0];
  }

  public hasJoin(): boolean {
    return Boolean(this.joinParts);
  }

  public addJoin(join: SqlJoinPart) {
    return this.changeJoinParts(
      this.joinParts ? this.joinParts.addLast(join) : SeparatedArray.fromSingleValue(join),
    );
  }

  public removeAllJoins() {
    return this.changeJoinParts(undefined);
  }
}

SqlBase.register(SqlFromClause.type, SqlFromClause);
