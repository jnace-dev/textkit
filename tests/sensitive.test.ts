import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SensitiveFilter } from '../src/filter/sensitive.ts';

describe('SensitiveFilter', () => {
  const words = ['暴力', '毒品', '赌博', 'abc'];

  it('has 检测', () => {
    const f = new SensitiveFilter();
    f.addWords(words);
    assert.equal(f.has('禁止暴力行为'), true);
    assert.equal(f.has('这是正常内容'), false);
  });

  it('findAll 返回位置', () => {
    const f = new SensitiveFilter();
    f.addWords(words);
    const hits = f.findAll('暴力与赌博');
    assert.equal(hits.length, 2);
    assert.equal(hits[0].word, '暴力');
    assert.equal(hits[1].word, '赌博');
  });

  it('replace 替换', () => {
    const f = new SensitiveFilter();
    f.addWords(words);
    assert.equal(f.replace('暴力与赌博'), '**与**');
  });

  it('count 计数', () => {
    const f = new SensitiveFilter();
    f.addWords(words);
    assert.equal(f.count('暴力与赌博'), 2);
    assert.equal(f.count('正常内容'), 0);
  });

  it('大小写不敏感（默认）', () => {
    const f = new SensitiveFilter();
    f.addWords(['ABC']);
    assert.equal(f.has('abc'), true);
  });

  it('大小写敏感模式', () => {
    const f = new SensitiveFilter({ caseSensitive: true });
    f.addWords(['ABC']);
    assert.equal(f.has('abc'), false);
    assert.equal(f.has('ABC'), true);
  });

  it('自定义替换字符', () => {
    const f = new SensitiveFilter({ replaceChar: '#' });
    f.addWords(['暴力']);
    assert.equal(f.replace('暴力'), '##');
  });

  it('空词库不误报', () => {
    const f = new SensitiveFilter();
    assert.equal(f.has('任何内容'), false);
    assert.equal(f.replace('任何内容'), '任何内容');
  });

  it('clear 清空', () => {
    const f = new SensitiveFilter();
    f.addWords(words);
    f.clear();
    assert.equal(f.size, 0);
    assert.equal(f.has('暴力'), false);
  });

  it('重叠命中', () => {
    const f = new SensitiveFilter();
    f.addWords(['abc', 'bc']);
    const hits = f.findAll('abc');
    const words2 = hits.map((h) => h.word).sort();
    assert.deepEqual(words2, ['abc', 'bc']);
  });
});