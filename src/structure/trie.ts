/**
 * Trie（前缀树 / 字典树）实现。
 *
 * 支持：插入、精确查找、前缀匹配、删除、按前缀枚举、全部词条收集。
 * 内部使用 Map 存储子节点，保证 O(L) 的插入与查找（L 为词条长度）。
 */

export interface TrieOptions {
  /** 是否区分大小写，默认 false（不区分） */
  caseSensitive?: boolean;
}

interface TrieNode {
  end: boolean;
  children: Map<string, TrieNode>;
}

export class Trie {
  private readonly root: TrieNode = { end: false, children: new Map() };
  private readonly caseSensitive: boolean;
  private _size = 0;

  constructor(options: TrieOptions = {}) {
    this.caseSensitive = options.caseSensitive ?? false;
  }

  /** 当前树中词条数量 */
  get size(): number {
    return this._size;
  }

  private normalize(word: string): string {
    return this.caseSensitive ? word : word.toLowerCase();
  }

  /** 插入一个词条，若已存在则不重复计数 */
  insert(word: string): void {
    if (word.length === 0) return;
    const key = this.normalize(word);
    let node = this.root;
    for (const ch of key) {
      let next = node.children.get(ch);
      if (!next) {
        next = { end: false, children: new Map() };
        node.children.set(ch, next);
      }
      node = next;
    }
    if (!node.end) {
      node.end = true;
      this._size++;
    }
  }

  /** 批量插入 */
  insertAll(words: Iterable<string>): void {
    for (const w of words) this.insert(w);
  }

  /** 精确查找词条是否存在 */
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.end;
  }

  /** 是否存在以 prefix 为前缀的词条 */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(word: string): TrieNode | null {
    const key = this.normalize(word);
    let node = this.root;
    for (const ch of key) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  /** 删除词条，返回是否成功删除 */
  delete(word: string): boolean {
    const key = this.normalize(word);
    const path: { node: TrieNode; ch: string }[] = [];
    let node = this.root;
    for (const ch of key) {
      const next = node.children.get(ch);
      if (!next) return false;
      path.push({ node, ch });
      node = next;
    }
    if (!node.end) return false;
    node.end = false;
    this._size--;
    // 自底向上清理无用分支
    for (let i = path.length - 1; i >= 0; i--) {
      const { node: parent, ch } = path[i];
      const child = parent.children.get(ch)!;
      if (!child.end && child.children.size === 0) {
        parent.children.delete(ch);
      } else {
        break;
      }
    }
    return true;
  }

  /** 清空所有词条 */
  clear(): void {
    this.root.children.clear();
    this.root.end = false;
    this._size = 0;
  }

  /** 枚举所有词条 */
  toArray(): string[] {
    const out: string[] = [];
    this.collect(this.root, '', out);
    return out;
  }

  /** 返回所有以 prefix 开头的词条 */
  autocomplete(prefix: string): string[] {
    const node = this.findNode(prefix);
    if (!node) return [];
    const out: string[] = [];
    this.collect(node, this.normalize(prefix), out);
    return out;
  }

  private collect(node: TrieNode, prefix: string, out: string[]): void {
    if (node.end) out.push(prefix);
    for (const [ch, child] of node.children) {
      this.collect(child, prefix + ch, out);
    }
  }

  /** 返回根节点（供高级用法，如敏感词扫描） */
  getRoot(): { end: boolean; children: Map<string, any> } {
    return this.root as any;
  }
}