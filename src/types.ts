/**
 * textkit — 文本算法工具库公共类型定义
 */

/** 敏感词命中结果 */
export interface SensitiveHit {
  /** 命中的敏感词 */
  word: string;
  /** 在文本中的起始下标 */
  start: number;
  /** 在文本中的结束下标（含） */
  end: number;
}

/** 编辑距离操作类型 */
export type EditOp = 'insert' | 'delete' | 'replace' | 'keep';

/** 单步编辑操作 */
export interface EditStep {
  op: EditOp;
  /** 源串字符（insert 时为 null） */
  from: string | null;
  /** 目标串字符（delete 时为 null） */
  to: string | null;
}

/** 文本相似度结果 */
export interface SimilarityResult {
  /** 相似度分值，0~1 */
  score: number;
  /** 使用的算法 */
  algorithm: string;
}