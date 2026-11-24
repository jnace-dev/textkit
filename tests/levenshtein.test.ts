import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance, editDistanceWithOps, levenshteinSimilarity } from '../src/string/levenshtein.ts';

describe('Levenshtein', () => {
  it('相同串距离为 0', () => {
    assert.equal(editDistance('abc', 'abc'), 0);
  });

  it('空串', () => {
    assert.equal(editDistance('', 'abc'), 3);
    assert.equal(editDistance('abc', ''), 3);
    assert.equal(editDistance('', ''), 0);
  });

  it('kitten -> sitting = 3', () => {
    assert.equal(editDistance('kitten', 'sitting'), 3);
  });

  it('saturday -> sunday = 3', () => {
    assert.equal(editDistance('saturday', 'sunday'), 3);
  });

  it('单字符替换', () => {
    assert.equal(editDistance('a', 'b'), 1);
  });

  it('对称性', () => {
    assert.equal(editDistance('abc', 'def'), editDistance('def', 'abc'));
  });

  it('相似度范围 0~1', () => {
    assert.equal(levenshteinSimilarity('abc', 'abc'), 1);
    assert.equal(levenshteinSimilarity('', ''), 1);
    const s = levenshteinSimilarity('abc', 'def');
    assert.ok(s >= 0 && s <= 1);
  });

  it('editDistanceWithOps 回溯操作', () => {
    const { distance, ops } = editDistanceWithOps('kitten', 'sitting');
    assert.equal(distance, 3);
    assert.ok(ops.length > 0);
    const opSet = new Set(ops.map((o) => o.op));
    assert.ok(opSet.size > 0);
  });

  it('editDistanceWithOps 空串', () => {
    const r = editDistanceWithOps('', 'abc');
    assert.equal(r.distance, 3);
    assert.equal(r.ops.every((o) => o.op === 'insert'), true);
  });
});