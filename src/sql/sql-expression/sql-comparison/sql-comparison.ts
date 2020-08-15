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

import { LiteralValue, SqlLiteral } from '..';
import { SqlBase, SqlBaseValue, SqlType, Substitutor } from '../../sql-base';
import { SqlExpression } from '../sql-expression';

import { SqlBetweenAndHelper } from './sql-between-and-helper';
import { SqlLikeEscapeHelper } from './sql-like-escape-helper';

export type EffectiveOp = '=' | '<>' | '<' | '>' | '<=' | '>=' | 'IS' | 'LIKE' | 'BETWEEN'; // ToDo: 'similar to' ?
export type SpecialLikeType = 'includes' | 'prefix' | 'postfix' | 'exact';

export interface SqlComparisonValue extends SqlBaseValue {
  op: string;
  notKeyword?: string;
  lhs: SqlExpression;
  rhs: SqlBase;
}

export class SqlComparison extends SqlExpression {
  static type: SqlType = 'comparison';

  static equal(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '=',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static unequal(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '<>',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static lessThan(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '<',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static greaterThan(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '>',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static lessThanOrEqual(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '<=',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static greaterThanOrEqual(
    lhs: SqlExpression | LiteralValue,
    rhs: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: '>=',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlExpression.wrap(rhs),
    });
  }

  static isNull(lhs: SqlExpression | LiteralValue): SqlComparison {
    return new SqlComparison({
      op: 'IS',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlLiteral.NULL,
    });
  }

  static isNotNull(lhs: SqlExpression | LiteralValue): SqlComparison {
    return SqlComparison.isNull(lhs).negate();
  }

  static like(
    lhs: SqlExpression | string,
    rhs: SqlExpression | string,
    escape?: SqlExpression | string,
  ): SqlComparison {
    const rhsEx = SqlExpression.wrap(rhs);
    return new SqlComparison({
      op: 'LIKE',
      lhs: SqlExpression.wrap(lhs),
      rhs: typeof escape === 'undefined' ? rhsEx : SqlLikeEscapeHelper.create(rhsEx, escape),
    });
  }

  static notLike(
    lhs: SqlExpression,
    rhs: SqlExpression | string,
    escape?: SqlExpression | string,
  ): SqlComparison {
    return SqlComparison.like(lhs, rhs, escape).negate();
  }

  static between(
    lhs: SqlExpression | LiteralValue,
    start: SqlExpression | LiteralValue,
    end: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: 'BETWEEN',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlBetweenAndHelper.create(SqlExpression.wrap(start), SqlExpression.wrap(end)),
    });
  }

  static notBetween(
    lhs: SqlExpression | LiteralValue,
    start: SqlExpression | LiteralValue,
    end: SqlExpression | LiteralValue,
  ): SqlComparison {
    return SqlComparison.between(lhs, start, end).negate();
  }

  static betweenSymmetric(
    lhs: SqlExpression | LiteralValue,
    start: SqlExpression | LiteralValue,
    end: SqlExpression | LiteralValue,
  ): SqlComparison {
    return new SqlComparison({
      op: 'BETWEEN',
      lhs: SqlExpression.wrap(lhs),
      rhs: SqlBetweenAndHelper.symmetric(SqlExpression.wrap(start), SqlExpression.wrap(end)),
    });
  }

  static notBetweenSymmetric(
    lhs: SqlExpression | LiteralValue,
    start: SqlExpression | LiteralValue,
    end: SqlExpression | LiteralValue,
  ): SqlComparison {
    return SqlComparison.betweenSymmetric(lhs, start, end).negate();
  }

  public readonly op: string;
  public readonly notKeyword?: string;
  public readonly lhs: SqlExpression;
  public readonly rhs: SqlBase;

  constructor(options: SqlComparisonValue) {
    super(options, SqlComparison.type);
    this.op = options.op;
    this.notKeyword = options.notKeyword;
    this.lhs = options.lhs;
    this.rhs = options.rhs;
  }

  public valueOf(): SqlComparisonValue {
    const value = super.valueOf() as SqlComparisonValue;
    value.op = this.op;
    value.notKeyword = this.notKeyword;
    value.lhs = this.lhs;
    value.rhs = this.rhs;
    return value;
  }

  protected _toRawString(): string {
    const { lhs, op, notKeyword, rhs } = this;
    const opIsIs = this.getEffectiveOp() === 'IS';

    const rawParts: string[] = [lhs.toString()];

    if (notKeyword && !opIsIs) {
      rawParts.push(this.getInnerSpace('not'), notKeyword);
    }

    rawParts.push(this.getInnerSpace('preOp'), op, this.getInnerSpace('postOp'));

    if (notKeyword && opIsIs) {
      rawParts.push(notKeyword, this.getInnerSpace('not'));
    }

    rawParts.push(rhs.toString());

    return rawParts.join('');
  }

  public getEffectiveOp(): EffectiveOp {
    const { op } = this;
    if (op === '!=') return '<>'; // Normalize inequality
    return op.toUpperCase() as EffectiveOp;
  }

  public changeLhs(lhs: SqlExpression): this {
    const value = this.valueOf();
    value.lhs = lhs;
    return SqlBase.fromValue(value);
  }

  public changeRhs(rhs: SqlBase): this {
    const value = this.valueOf();
    value.rhs = rhs;
    return SqlBase.fromValue(value);
  }

  public negate(): this {
    let { op, notKeyword } = this;
    switch (this.getEffectiveOp()) {
      case '=':
        op = '!=';
        break;

      case '<>':
        op = '=';
        break;

      case '<':
        op = '>=';
        break;

      case '>':
        op = '<=';
        break;

      case '<=':
        op = '>';
        break;

      case '>=':
        op = '<';
        break;

      default:
        notKeyword = notKeyword ? undefined : 'NOT';
        break;
    }

    const value = this.valueOf();
    value.op = op;
    value.notKeyword = notKeyword;
    return SqlBase.fromValue(value);
  }

  public _walkInner(
    nextStack: SqlBase[],
    fn: Substitutor,
    postorder: boolean,
  ): SqlExpression | undefined {
    let ret = this;

    const lhs = this.lhs._walkHelper(nextStack, fn, postorder);
    if (!lhs) return;
    if (lhs !== this.lhs) {
      ret = ret.changeLhs(lhs);
    }

    const rhs = this.rhs._walkHelper(nextStack, fn, postorder);
    if (!rhs) return;
    if (rhs !== this.rhs) {
      ret = ret.changeRhs(rhs);
    }

    return ret;
  }

  public getLikeMatchPattern(): string | undefined {
    if (this.getEffectiveOp() !== 'LIKE') return;
    const { rhs } = this;
    if (rhs instanceof SqlLiteral) {
      return rhs.getStringValue();
    } else if (rhs instanceof SqlLikeEscapeHelper && rhs.like instanceof SqlLiteral) {
      return rhs.like.getStringValue();
    }
    return;
  }

  public getSpecialLikeType(): SpecialLikeType | undefined {
    const likeMatchPattern = this.getLikeMatchPattern();
    if (typeof likeMatchPattern !== 'string') return;
    if (likeMatchPattern.endsWith('%')) {
      if (likeMatchPattern.startsWith('%')) {
        return 'includes'; // %blah%
      } else {
        return 'prefix'; // blah%
      }
    } else if (likeMatchPattern.startsWith('%')) {
      return 'postfix'; // %blah
    } else {
      return 'exact'; // blah
    }
  }
}

SqlBase.register(SqlComparison);
