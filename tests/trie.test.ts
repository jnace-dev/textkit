import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Trie } from '../src/structure/trie.ts';

describe('Trie', () => {
  it('插入与精确查找', () => {
    const t = new Trie();
    t.insert('hello');
    assert.equal(t.search('hello'), true);
    assert.equal(t.search('hell'), false);
    assert.equal(t.search('helloo'), false);
  });

  it('前缀匹配', () => {
    const t = new Trie();
    t.insertAll(['apple', 'application', 'banana']);
    assert.equal(t.startsWith('app'), true);
    assert.equal(t.startsWith('ban'), true);
    assert.equal(t.startsWith('cat'), false);
  });

  it('自动补全', () => {
    const t = new Trie();
    t.insertAll(['apple', 'application', 'app', 'banana']);
    assert.deepEqual(t.autocomplete('app').sort(), ['app', 'apple', 'application']);
    assert.deepEqual(t.autocomplete('ban'), ['banana']);
    assert.deepEqual(t.autocomplete('x'), []);
  });

  it('删除词条', () => {
    const t = new Trie();
    t.insertAll(['abc', 'abcd']);
    assert.equal(t.delete('abc'), true);
    assert.equal(t.search('abc'), false);
    assert.equal(t.search('abcd'), true);
    assert.equal(t.delete('not-exist'), false);
  });

  it('大小写不敏感（默认）', () => {
    const t = new Trie();
    t.insert('Hello');
    assert.equal(t.search('HELLO'), true);
    assert.equal(t.startsWith('hel'), true);
  });

  it('大小写敏感模式', () => {
    const t = new Trie({ caseSensitive: true });
    t.insert('Hello');
    assert.equal(t.search('hello'), false);
    assert.equal(t.search('Hello'), true);
  });

  it('空串插入不计数', () => {
    const t = new Trie();
    t.insert('');
    assert.equal(t.size, 0);
  });

  it('重复插入不重复计数', () => {
    const t = new Trie();
    t.insert('x');
    t.insert('x');
    assert.equal(t.size, 1);
  });

  it('toArray 收集全部词条', () => {
    const t = new Trie();
    t.insertAll(['c', 'b', 'a']);
    assert.deepEqual(t.toArray().sort(), ['a', 'b', 'c']);
  });

  it('clear 清空', () => {
    const t = new Trie();
    t.insertAll(['a', 'b']);
    t.clear();
    assert.equal(t.size, 0);
    assert.deepEqual(t.toArray(), []);
  });
});