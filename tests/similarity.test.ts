import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  jaccardSimilarity,
  cosineSimilarity,
  diceCoefficient,
  editSimilarity,
  combinedSimilarity,
} from '../src/string/similarity.ts';

describe('Similarity', () => {
  it('jaccard 相同为 1', () => {
    assert.equal(jaccardSimilarity('abc', 'abc'), 1);
  });

  it('jaccard 无交集为 0', () => {
    assert.equal(jaccardSimilarity('abc', 'def'), 0);
  });

  it('jaccard 部分交集', () => {
    assert.equal(jaccardSimilarity('abc', 'bcd'), 0.5);
  });

  it('cosine 相同为 1', () => {
    assert.ok(Math.abs(cosineSimilarity('abc', 'abc') - 1) < 1e-12);
  });

  it('cosine 无交集为 0', () => {
    assert.equal(cosineSimilarity('abc', 'def'), 0);
  });

  it('dice 相同为 1', () => {
    assert.equal(diceCoefficient('abc', 'abc'), 1);
  });

  it('dice 计算', () => {
    assert.equal(diceCoefficient('abc', 'bcd'), 2 / 3);
  });

  it('editSimilarity 相同为 1', () => {
    assert.equal(editSimilarity('abc', 'abc'), 1);
  });

  it('editSimilarity 范围', () => {
    const s = editSimilarity('kitten', 'sitting');
    assert.ok(s >= 0 && s <= 1);
  });

  it('combinedSimilarity 相同为 1', () => {
    assert.equal(combinedSimilarity('abc', 'abc'), 1);
  });

  it('combinedSimilarity 自定义权重', () => {
    const s = combinedSimilarity('abc', 'abd', { jaccard: 1, cosine: 0, dice: 0, edit: 0 });
    assert.equal(s, 0.5);
  });

  it('空串相似度', () => {
    assert.equal(jaccardSimilarity('', ''), 1);
    assert.equal(cosineSimilarity('', ''), 0);
    assert.equal(diceCoefficient('', ''), 1);
    assert.equal(editSimilarity('', ''), 1);
  });
});