/**
 * 中文数字字面量与转换表。
 *
 * 该表覆盖 0~9 数字、单位（十/百/千/万/亿）以及中文数字字符。
 * 用于中文数字与阿拉伯数字的双向转换。
 */

/** 中文数字字符 -> 阿拉伯数字 */
export const CN_DIGIT_MAP: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  壹: 1,
  二: 2,
  贰: 2,
  两: 2,
  三: 3,
  叁: 3,
  四: 4,
  肆: 4,
  五: 5,
  伍: 5,
  六: 6,
  陆: 6,
  七: 7,
  柒: 7,
  八: 8,
  捌: 8,
  九: 9,
  玖: 9,
};

/** 单位字符 -> 量级 */
export const CN_UNIT_MAP: Record<string, number> = {
  十: 10,
  拾: 10,
  百: 100,
  佰: 100,
  千: 1000,
  仟: 1000,
  万: 10_000,
  萬: 10_000,
  亿: 100_000_000,
  億: 100_000_000,
};

/** 阿拉伯数字 -> 中文小写数字 */
export const ARABIC_TO_CN_LOWER: string[] = [
  '零', '一', '二', '三', '四', '五', '六', '七', '八', '九',
];

/** 阿拉伯数字 -> 中文大写数字 */
export const ARABIC_TO_CN_UPPER: string[] = [
  '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖',
];

/** 小写单位 */
export const CN_LOWER_UNITS: string[] = ['', '十', '百', '千'];

/** 大写单位 */
export const CN_UPPER_UNITS: string[] = ['', '拾', '佰', '仟'];

/** 万/亿节单位 */
export const CN_SECTION_UNITS: string[] = ['', '万', '亿'];

/** 判断字符是否为中文数字字符（含大写） */
export function isChineseDigitChar(ch: string): boolean {
  return ch in CN_DIGIT_MAP || ch in CN_UNIT_MAP;
}