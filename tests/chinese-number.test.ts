import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toChineseNumber, fromChineseNumber } from '../src/convert/chinese-number.ts';

describe('ChineseNumber', () => {
  describe('toChineseNumber', () => {
    it('零', () => {
      assert.equal(toChineseNumber(0), '零');
    });

    it('个位数', () => {
      assert.equal(toChineseNumber(5), '五');
    });

    it('十', () => {
      assert.equal(toChineseNumber(10), '十');
      assert.equal(toChineseNumber(11), '十一');
      assert.equal(toChineseNumber(20), '二十');
    });

    it('百', () => {
      assert.equal(toChineseNumber(100), '一百');
      assert.equal(toChineseNumber(101), '一百零一');
      assert.equal(toChineseNumber(110), '一百一十');
    });

    it('千', () => {
      assert.equal(toChineseNumber(1000), '一千');
      assert.equal(toChineseNumber(1001), '一千零一');
      assert.equal(toChineseNumber(1010), '一千零一十');
    });

    it('万', () => {
      assert.equal(toChineseNumber(10000), '一万');
      assert.equal(toChineseNumber(10001), '一万零一');
      assert.equal(toChineseNumber(12345), '一万二千三百四十五');
    });

    it('亿', () => {
      assert.equal(toChineseNumber(100000000), '一亿');
      assert.equal(toChineseNumber(100001000), '一亿零一千');
    });

    it('负数', () => {
      assert.equal(toChineseNumber(-123), '负一百二十三');
    });

    it('小数', () => {
      assert.equal(toChineseNumber(3.14), '三点一四');
    });

    it('大写模式', () => {
      assert.equal(toChineseNumber(12345, { uppercase: true }), '壹万贰仟叁佰肆拾伍');
    });

    it('非有限数字抛错', () => {
      assert.throws(() => toChineseNumber(NaN), TypeError);
      assert.throws(() => toChineseNumber(Infinity), TypeError);
    });
  });

  describe('fromChineseNumber', () => {
    it('零', () => {
      assert.equal(fromChineseNumber('零'), 0);
    });

    it('个位数', () => {
      assert.equal(fromChineseNumber('五'), 5);
    });

    it('十', () => {
      assert.equal(fromChineseNumber('十'), 10);
      assert.equal(fromChineseNumber('十一'), 11);
      assert.equal(fromChineseNumber('二十'), 20);
    });

    it('百', () => {
      assert.equal(fromChineseNumber('一百'), 100);
      assert.equal(fromChineseNumber('一百零一'), 101);
    });

    it('万', () => {
      assert.equal(fromChineseNumber('一万'), 10000);
      assert.equal(fromChineseNumber('一万零一'), 10001);
      assert.equal(fromChineseNumber('一万二千三百四十五'), 12345);
    });

    it('亿', () => {
      assert.equal(fromChineseNumber('一亿'), 100000000);
      assert.equal(fromChineseNumber('一亿零一千'), 100001000);
    });

    it('负数', () => {
      assert.equal(fromChineseNumber('负一百二十三'), -123);
    });

    it('小数', () => {
      assert.equal(fromChineseNumber('三点一四'), 3.14);
    });

    it('大写', () => {
      assert.equal(fromChineseNumber('壹万贰仟叁佰肆拾伍'), 12345);
    });

    it('空串抛错', () => {
      assert.throws(() => fromChineseNumber(''), TypeError);
    });

    it('无效字符抛错', () => {
      assert.throws(() => fromChineseNumber('abc'), TypeError);
    });
  });

  describe('双向一致性', () => {
    it('往返转换一致', () => {
      const cases = [0, 1, 10, 11, 20, 100, 101, 110, 1000, 1001, 1010,
        10000, 10001, 12345, 100000000, 100001000, 999999999];
      for (const n of cases) {
        const cn = toChineseNumber(n);
        const back = fromChineseNumber(cn);
        assert.equal(back, n);
      }
    });
  });
});