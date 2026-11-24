/**
 * 文本相似度算法集合。
 *
 * 提供：Jaccard 字符相似度、余弦字符相似度、Dice 系数、
 * 以及基于编辑距离的归一化相似度。
 */

import { editDistance } from './levenshtein.ts';

/** 将字符串拆为字符集合 */
function toCharSet(s: string): Set<string> {
  return new Set<string>(s);
}

/** 将字符串拆为字符频次 Map */
function toCharFreq(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  return freq;
}

/**
 * Jaccard 相似度：|A∩B| / |A∪B|，基于字符集合。
 * 范围 0~1，两串完全相同返回 1，无公共字符返回 0。
 */
export function jaccardSimilarity(a: string, b: string): number {
  const sa = toCharSet(a);
  const sb = toCharSet(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const ch of sa) if (sb.has(ch)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * 余弦相似度：基于字符频次向量的夹角余弦。
 * 范围 0~1。
 */
export function cosineSimilarity(a: string, b: string): number {
  const fa = toCharFreq(a);
  const fb = toCharFreq(b);
  let dot = 0;
  for (const [ch, ca] of fa) {
    const cb = fb.get(ch);
    if (cb) dot += ca * cb;
  }
  let na = 0;
  for (const c of fa.values()) na += c * c;
  let nb = 0;
  for (const c of fb.values()) nb += c * c;
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Dice 系数（Sørensen–Dice）：2|A∩B| / (|A| + |B|)，基于字符集合。
 * 范围 0~1。
 */
export function diceCoefficient(a: string, b: string): number {
  const sa = toCharSet(a);
  const sb = toCharSet(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const ch of sa) if (sb.has(ch)) inter++;
  const total = sa.size + sb.size;
  return total === 0 ? 0 : (2 * inter) / total;
}

/**
 * 基于编辑距离的归一化相似度。
 * 1 - editDistance(a,b) / max(len(a), len(b))。
 */
export function editSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - editDistance(a, b) / maxLen;
}

/**
 * 综合相似度：对多种算法取加权平均，减少单一算法偏差。
 * 权重默认：Jaccard 0.25 / 余弦 0.35 / Dice 0.2 / 编辑 0.2。
 */
export function combinedSimilarity(
  a: string,
  b: string,
  weights: { jaccard?: number; cosine?: number; dice?: number; edit?: number } = {},
): number {
  const w = {
    jaccard: weights.jaccard ?? 0.25,
    cosine: weights.cosine ?? 0.35,
    dice: weights.dice ?? 0.2,
    edit: weights.edit ?? 0.2,
  };
  const total = w.jaccard + w.cosine + w.dice + w.edit;
  if (total === 0) return 0;
  const score =
    w.jaccard * jaccardSimilarity(a, b) +
    w.cosine * cosineSimilarity(a, b) +
    w.dice * diceCoefficient(a, b) +
    w.edit * editSimilarity(a, b);
  return score / total;
}