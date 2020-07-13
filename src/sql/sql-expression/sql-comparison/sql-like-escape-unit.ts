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
import { SqlLiteral } from '..';
import { SqlBase, SqlBaseValue, Substitutor } from '../../sql-base';

export interface SqlLikeEscapeUnitValue extends SqlBaseValue {
  like: SqlLiteral;
  escapeKeyword?: string;
  escape: SqlLiteral;
}

export class SqlLikeEscapeUnit extends SqlBase {
  static type = 'likeEscapeUnit';

  static DEFAULT_ESCAPE_KEYWORD = 'AND';

  static create(like: SqlLiteral, escape: SqlLiteral): SqlLikeEscapeUnit {
    return new SqlLikeEscapeUnit({
      like,
      escape,
    });
  }

  public readonly like: SqlLiteral;
  public readonly escapeKeyword?: string;
  public readonly escape: SqlLiteral;

  constructor(options: SqlLikeEscapeUnitValue) {
    super(options, SqlLikeEscapeUnit.type);
    this.like = options.like;
    this.escapeKeyword = options.escapeKeyword;
    this.escape = options.escape;
  }

  public valueOf(): SqlLikeEscapeUnitValue {
    const value = super.valueOf() as SqlLikeEscapeUnitValue;
    value.like = this.like;
    value.escapeKeyword = this.escapeKeyword;
    value.escape = this.escape;
    return value;
  }

  protected _toRawString(): string {
    const rawParts: string[] = [
      this.like.toString(),
      this.getInnerSpace('preEscape'),
      this.escapeKeyword || SqlLikeEscapeUnit.DEFAULT_ESCAPE_KEYWORD,
      this.getInnerSpace('postEscape'),
      this.escape.toString(),
    ];

    return rawParts.join('');
  }

  public changeLike(like: SqlLiteral): this {
    const value = this.valueOf();
    value.like = like;
    return SqlBase.fromValue(value);
  }

  public changeEscape(escape: SqlLiteral): this {
    const value = this.valueOf();
    value.escape = escape;
    return SqlBase.fromValue(value);
  }

  public _walkInner(
    nextStack: SqlBase[],
    fn: Substitutor,
    postorder: boolean,
  ): SqlBase | undefined {
    let ret = this;

    const like = ret.like._walkHelper(nextStack, fn, postorder);
    if (!like) return;
    if (like !== ret.like) {
      ret = ret.changeLike(like as SqlLiteral);
    }

    const escape = ret.escape._walkHelper(nextStack, fn, postorder);
    if (!escape) return;
    if (escape !== ret.escape) {
      ret = ret.changeEscape(escape as SqlLiteral);
    }

    return ret;
  }

  public clearStaticKeywords(): this {
    const value = this.valueOf();
    delete value.escapeKeyword;
    return SqlBase.fromValue(value);
  }
}

SqlBase.register(SqlLikeEscapeUnit.type, SqlLikeEscapeUnit);
