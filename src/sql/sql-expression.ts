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

import { SqlBase } from './sql-base';
import { SqlRef } from './sql-ref/sql-ref';

export abstract class SqlExpression extends SqlBase {
  public containsColumn(_column: string): boolean {
    return false;
  }

  public removeColumn(_column: string): SqlExpression | undefined {
    return this;
  }

  public getSqlRefs(): SqlRef[] {
    return [];
  }

  public addOrReplaceColumn(_column: string, _filter: SqlExpression): SqlExpression {
    return this;
  }
}
