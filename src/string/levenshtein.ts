/**
 * Levenshtein 编辑距离算法。
 *
 * editDistance(a, b) 返回将 a 转换为 b 所需的最少单字符编辑
 * （插入 / 删除 / 替换）次数。
 *
 * 提供两种实现：
 * - editDistance：标准 DP，O(mn) 时间，O(min(m,n)) 空间
 * - editDistanceWithOps：回溯具体操作序列
 */

import type { EditStep } from '../types';

/**
 * 计算两个字符串的编辑距离。
 * @param a 源串
 * @param b 目标串
 * @returns 最少编辑次数
 */
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // 滚动数组：以较短的串为列维度以节省空间
  if (m < n) [a, b] = [b, a];
  const prev = new Array<number>(n + 1);
  const curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const del = prev[j] + 1; // 删除 a[i-1]
      const ins = curr[j - 1] + 1; // 插入 b[j-1]
      const sub = prev[j - 1] + cost; // 替换
      curr[j] = Math.min(del, ins, sub);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

/**
 * 计算编辑距离并回溯具体操作序列。
 * @returns 操作数组（从 a 到 b 的编辑步骤）
 */
export function editDistanceWithOps(a: string, b: string): { distance: number; ops: EditStep[] } {
  const m = a.length;
  const n = b.length;
  // 完整 DP 矩阵用于回溯
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // 删除
        dp[i][j - 1] + 1, // 插入
        dp[i - 1][j - 1] + cost, // 替换/保留
      );
    }
  }

  const ops: EditStep[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      if (a[i - 1] === b[j - 1]) {
        ops.push({ op: 'keep', from: a[i - 1], to: b[j - 1] });
      } else {
        ops.push({ op: 'replace', from: a[i - 1], to: b[j - 1] });
      }
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ op: 'delete', from: a[i - 1], to: null });
      i--;
    } else {
      ops.push({ op: 'insert', from: null, to: b[j - 1] });
      j--;
    }
  }
  ops.reverse();
  return { distance: dp[m][n], ops };
}

/**
 * 归一化相似度：1 - distance / max(len(a), len(b))。
 * 完全相同返回 1，完全不同返回 0。
 */
export function levenshteinSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - editDistance(a, b) / maxLen;
}