/**
 * 基于 Trie 的敏感词过滤器。
 *
 * 支持：添加词、检测是否存在、查找全部命中、替换命中词、
 * 统计命中数。采用 DFA（确定性有限状态机）扫描，单次遍历即可
 * 找出所有敏感词，时间复杂度 O(n * L)（n 为文本长度，L 为最长词长）。
 */

import { Trie } from '../structure/trie.ts';
import type { SensitiveHit } from '../types';

export interface SensitiveFilterOptions {
  /** 是否区分大小写，默认 false */
  caseSensitive?: boolean;
  /** 命中替换字符，默认 '*' */
  replaceChar?: string;
}

export class SensitiveFilter {
  private readonly trie: Trie;
  private readonly replaceChar: string;
  private readonly caseSensitive: boolean;

  constructor(options: SensitiveFilterOptions = {}) {
    this.caseSensitive = options.caseSensitive ?? false;
    this.replaceChar = options.replaceChar ?? '*';
    this.trie = new Trie({ caseSensitive: this.caseSensitive });
  }

  private norm(s: string): string {
    return this.caseSensitive ? s : s.toLowerCase();
  }

  /** 添加单个敏感词 */
  addWord(word: string): void {
    if (word.length > 0) this.trie.insert(word);
  }

  /** 批量添加敏感词 */
  addWords(words: Iterable<string>): void {
    for (const w of words) this.addWord(w);
  }

  /** 清空敏感词库 */
  clear(): void {
    this.trie.clear();
  }

  /** 当前词库词条数 */
  get size(): number {
    return this.trie.size;
  }

  /** 文本中是否包含任意敏感词 */
  has(text: string): boolean {
    const t = this.norm(text);
    const root = this.trie.getRoot() as { end: boolean; children: Map<string, any> };
    for (let i = 0; i < t.length; i++) {
      let node: any = root;
      for (let j = i; j < t.length; j++) {
        const next = node.children.get(t[j]);
        if (!next) break;
        node = next;
        if (node.end) return true;
      }
    }
    return false;
  }

  /** 查找文本中所有命中的敏感词及其位置 */
  findAll(text: string): SensitiveHit[] {
    const t = this.norm(text);
    const root = this.trie.getRoot() as { end: boolean; children: Map<string, any> };
    const hits: SensitiveHit[] = [];
    for (let i = 0; i < t.length; i++) {
      let node: any = root;
      for (let j = i; j < t.length; j++) {
        const next = node.children.get(t[j]);
        if (!next) break;
        node = next;
        if (node.end) {
          hits.push({ word: text.slice(i, j + 1), start: i, end: j });
        }
      }
    }
    return hits;
  }

  /** 命中数 */
  count(text: string): number {
    return this.findAll(text).length;
  }

  /** 将命中的敏感词替换为指定字符 */
  replace(text: string, char?: string): string {
    const ch = char ?? this.replaceChar;
    const hits = this.findAll(text);
    if (hits.length === 0) return text;
    const arr = text.split('');
    for (const h of hits) {
      for (let k = h.start; k <= h.end; k++) arr[k] = ch;
    }
    return arr.join('');
  }

  /** 返回脱敏后的文本（每个命中词用等长替换串遮盖） */
  mask(text: string, char?: string): string {
    const ch = char ?? this.replaceChar;
    const hits = this.findAll(text);
    if (hits.length === 0) return text;
    const arr = text.split('');
    for (const h of hits) {
      for (let k = h.start; k <= h.end; k++) arr[k] = ch;
    }
    return arr.join('');
  }
}