import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { kmpSearch, kmpContains, kmpCount, buildKmpNext } from '../src/string/kmp.ts';

describe('KMP', () => {
  it('buildKmpNext', () => {
    assert.deepEqual(buildKmpNext(''), []);
    assert.deepEqual(buildKmpNext('a'), [0]);
    assert.deepEqual(buildKmpNext('ABCDABD'), [0, 0, 0, 0, 1, 2, 0]);
  });

  it('基本查找', () => {
    assert.deepEqual(kmpSearch('ababcabcab', 'abc'), [2, 5]);
  });

  it('无匹配', () => {
    assert.deepEqual(kmpSearch('hello', 'xyz'), []);
  });

  it('空模式返回空', () => {
    assert.deepEqual(kmpSearch('hello', ''), []);
  });

  it('重叠匹配', () => {
    assert.deepEqual(kmpSearch('aaaa', 'aa'), [0, 1, 2]);
  });

  it('kmpContains', () => {
    assert.equal(kmpContains('hello world', 'world'), true);
    assert.equal(kmpContains('hello world', 'earth'), false);
    assert.equal(kmpContains('abc', ''), true);
  });

  it('kmpCount', () => {
    assert.equal(kmpCount('aaaa', 'aa'), 3);
    assert.equal(kmpCount('ababab', 'aba'), 2);
    assert.equal(kmpCount('hello', 'x'), 0);
  });

  it('长文本一致性：与 indexOf 结果一致', () => {
    const text = 'a'.repeat(1000) + 'b' + 'a'.repeat(1000);
    const pattern = 'aa';
    const kmp = kmpSearch(text, pattern);
    const ref = [];
    let idx = text.indexOf(pattern);
    while (idx !== -1) {
      ref.push(idx);
      idx = text.indexOf(pattern, idx + 1);
    }
    assert.deepEqual(kmp, ref);
  });
});