/**
 * 命名格式转换工具。
 *
 * 支持 camelCase / PascalCase / kebab-case / snake_case / SCREAMING_SNAKE
 * 之间的互相转换，以及空格与分隔符的归一化。
 */

/** 将输入串按分隔符（-、_、空格、点）及大小写边界切分为词序列 */
function tokenize(input: string): string[] {
  if (input.length === 0) return [];
  // 在大小写边界插入 \x00 作为分词标记
  const normalized = input
    .replace(/([a-z0-9])([A-Z])/g, '$1\x00$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1\x00$2');
  // 先按 \x00 切分，再按分隔符合并切分，最后过滤空串
  const parts: string[] = [];
  for (const segment of normalized.split('\x00')) {
    for (const tok of segment.split(/[\s\-_.,:;|]+/)) {
      if (tok.length > 0) parts.push(tok);
    }
  }
  return parts;
}

function lower(s: string): string {
  return s.toLowerCase();
}

function upper(s: string): string {
  return s.toUpperCase();
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** 转为 camelCase */
export function toCamelCase(input: string): string {
  const tokens = tokenize(input);
  if (tokens.length === 0) return '';
  return lower(tokens[0]) + tokens.slice(1).map(cap).join('');
}

/** 转为 PascalCase */
export function toPascalCase(input: string): string {
  return tokenize(input).map(cap).join('');
}

/** 转为 kebab-case */
export function toKebabCase(input: string): string {
  return tokenize(input).map(lower).join('-');
}

/** 转为 snake_case */
export function toSnakeCase(input: string): string {
  return tokenize(input).map(lower).join('_');
}

/** 转为 SCREAMING_SNAKE_CASE */
export function toScreamingSnakeCase(input: string): string {
  return tokenize(input).map(upper).join('_');
}

/** 转为 "Title Case" 形式 */
export function toTitleCase(input: string): string {
  return tokenize(input).map(cap).join(' ');
}

/** 转为 "sentence case" 形式 */
export function toSentenceCase(input: string): string {
  const tokens = tokenize(input);
  if (tokens.length === 0) return '';
  return lower(tokens[0]) + tokens.slice(1).map((t) => ' ' + lower(t)).join('');
}

/** 格式转换结果 */
export interface CaseFormats {
  camel: string;
  pascal: string;
  kebab: string;
  snake: string;
  screaming: string;
  title: string;
  sentence: string;
}

/** 一次性生成所有命名格式 */
export function toAllCases(input: string): CaseFormats {
  return {
    camel: toCamelCase(input),
    pascal: toPascalCase(input),
    kebab: toKebabCase(input),
    snake: toSnakeCase(input),
    screaming: toScreamingSnakeCase(input),
    title: toTitleCase(input),
    sentence: toSentenceCase(input),
  };
}