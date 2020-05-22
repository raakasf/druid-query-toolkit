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

import { SqlRef } from '..';
import { SqlBase, SqlBaseValue } from '../sql-base';

export interface SqlAliasRefValue extends SqlBaseValue {
  expression: SqlBase;
  asKeyword: string;
  alias: SqlRef;
}

export class SqlAliasRef extends SqlBase {
  static type = 'alias-ref';

  static sqlAliasFactory(column: SqlBase, alias: string) {
    return new SqlAliasRef({
      type: SqlAliasRef.type,
      expression: column,
      asKeyword: 'AS',
      alias: SqlRef.fromStringWithDoubleQuotes(alias),
    } as SqlAliasRefValue);
  }

  public readonly column: SqlBase;
  public readonly asKeyword: string;
  public readonly alias: SqlRef;

  constructor(options: SqlAliasRefValue) {
    super(options, SqlAliasRef.type);
    this.column = options.expression;
    this.asKeyword = options.asKeyword;
    this.alias = options.alias;
  }

  public upgrade() {
    const value = this.valueOf();
    value.alias = value.alias.upgrade();
    return new SqlAliasRef(value);
  }

  public valueOf() {
    const value = super.valueOf() as SqlAliasRefValue;
    value.expression = this.column;
    value.asKeyword = this.asKeyword;
    value.alias = this.alias;
    return value as SqlAliasRefValue;
  }

  public toRawString(): string {
    return [
      this.column,
      this.getInnerSpace('postExpression'),
      this.asKeyword,
      this.getInnerSpace('postAs'),
      this.alias.toString(),
    ].join('');
  }
}

SqlBase.register(SqlAliasRef.type, SqlAliasRef);
