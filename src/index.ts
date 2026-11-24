/**
 * textkit — TypeScript 文本算法工具库
 *
 * 一个面向开源的、零依赖的文本算法集合，覆盖前缀树、敏感词过滤、
 * 字符串匹配、编辑距离、文本相似度、命名格式转换、中文数字转换等场景。
 *
 * 所有模块均为纯 TypeScript 实现，可直接在 Node.js / 浏览器 / 构建工具链中使用。
 */

export { Trie } from './structure/trie';
export type { TrieOptions } from './structure/trie';

export { SensitiveFilter } from './filter/sensitive';
export type { SensitiveHit, SensitiveFilterOptions } from './filter/sensitive';

export {
  editDistance,
  editDistanceWithOps,
  levenshteinSimilarity,
} from './string/levenshtein';
export type { EditStep } from './types';

export {
  buildKmpNext,
  kmpSearch,
  kmpContains,
  kmpCount,
} from './string/kmp';

export {
  jaccardSimilarity,
  cosineSimilarity,
  diceCoefficient,
  editSimilarity,
  combinedSimilarity,
} from './string/similarity';
export type { SimilarityResult } from './types';

export {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toTitleCase,
  toSentenceCase,
  toAllCases,
} from './string/format';
export type { CaseFormats } from './string/format';

export {
  toChineseNumber,
  fromChineseNumber,
} from './convert/chinese-number';
export type { ToChineseOptions } from './convert/chinese-number';