/**
 * KMP（Knuth-Morris-Pratt）字符串匹配算法。
 *
 * 通过前缀函数（partial match table / next 数组）避免在失配时
 * 回退主串指针，实现 O(n + m) 的单次匹配。
 */

/**
 * 构建 KMP 前缀函数（next 数组）。
 * next[i] 表示 pattern[0..i) 的最长相等前后缀长度。
 */
export function buildKmpNext(pattern: string): number[] {
  const n = pattern.length;
  const next = new Array<number>(n).fill(0);
  if (n <= 1) return next;
  let k = 0;
  for (let i = 1; i < n; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) {
      k = next[k - 1];
    }
    if (pattern[i] === pattern[k]) {
      k++;
    }
    next[i] = k;
  }
  return next;
}

/**
 * 在 text 中查找 pattern 的所有出现位置。
 * @returns 起始下标数组（升序）
 */
export function kmpSearch(text: string, pattern: string): number[] {
  if (pattern.length === 0) return [];
  const next = buildKmpNext(pattern);
  const out: number[] = [];
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = next[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === pattern.length) {
      out.push(i - j + 1);
      j = next[j - 1];
    }
  }
  return out;
}

/**
 * 判断 text 是否包含 pattern。
 */
export function kmpContains(text: string, pattern: string): boolean {
  if (pattern.length === 0) return true;
  return kmpSearch(text, pattern).length > 0;
}

/**
 * KMP 计数：返回 pattern 在 text 中出现的次数。
 */
export function kmpCount(text: string, pattern: string): number {
  return kmpSearch(text, pattern).length;
}