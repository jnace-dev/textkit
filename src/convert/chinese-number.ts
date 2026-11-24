/**
 * 中文数字与阿拉伯数字双向转换。
 *
 * 支持：
 * - 阿拉伯数字 -> 中文小写/大写（含小数、负数）
 * - 中文数字 -> 阿拉伯数字（含大写、负数、小数）
 * - 自动处理零的省略规则与"一十"省略"一"的规则
 */

import {
  CN_DIGIT_MAP,
  CN_UNIT_MAP,
  ARABIC_TO_CN_LOWER,
  ARABIC_TO_CN_UPPER,
  CN_LOWER_UNITS,
  CN_UPPER_UNITS,
  CN_SECTION_UNITS,
} from '../data/chinese-number.ts';

export interface ToChineseOptions {
  /** 是否使用大写（壹贰叁…），默认 false */
  uppercase?: boolean;
}

/** 将阿拉伯数字转为中文数字字符串 */
export function toChineseNumber(value: number, options: ToChineseOptions = {}): string {
  if (!Number.isFinite(value)) {
    throw new TypeError('toChineseNumber: 输入必须是有限数字');
  }
  const uppercase = options.uppercase ?? false;
  const digits = uppercase ? ARABIC_TO_CN_UPPER : ARABIC_TO_CN_LOWER;
  const units = uppercase ? CN_UPPER_UNITS : CN_LOWER_UNITS;

  if (value === 0) return digits[0];

  let negative = false;
  if (value < 0) {
    negative = true;
    value = -value;
  }

  // 分离整数与小数
  const intPart = Math.trunc(value);
  const decPart = value - intPart;

  let result = convertInteger(intPart, digits, units);

  if (decPart > 0) {
    const decStr = decPart.toFixed(10).replace(/^0\./, '').replace(/0+$/, '');
    if (decStr.length > 0) {
      let decChars = '';
      for (const ch of decStr) {
        decChars += digits[Number(ch)];
      }
      result += '点' + decChars;
    }
  }

  return (negative ? '负' : '') + result;
}

/**
 * 转换整数部分：按万/亿分节，每节 4 位。
 * 规则：
 * - 连续零合并为一个零
 * - 末尾零省略
 * - 最高节的"一十"省略为"十"
 */
function convertInteger(
  num: number,
  digits: string[],
  units: string[],
): string {
  if (num === 0) return digits[0];

  // 分节：每 4 位一节
  const sections: number[] = [];
  let n = num;
  while (n > 0) {
    sections.push(n % 10000);
    n = Math.floor(n / 10000);
  }

  const parts: string[] = [];
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = sections[i];
    if (sec === 0) {
      // 零节：若上一节非空则补一个零
      if (parts.length > 0 && !parts[parts.length - 1].endsWith(digits[0])) {
        parts.push(digits[0]);
      }
      continue;
    }
    const isTop = i === sections.length - 1;
    const secStr = convertSection(sec, digits, units, !isTop);
    // "一十"省略规则：仅当是最高节且以"一十"开头
    if (isTop && secStr.startsWith(digits[1] + units[1])) {
      parts.push(secStr.slice(digits[1].length));
    } else {
      parts.push(secStr);
    }
    parts.push(CN_SECTION_UNITS[i]);
  }

  let result = parts.join('');
  // 清理末尾零
  result = result.replace(new RegExp(digits[0] + '+$'), '');
  // 合并连续零
  result = result.replace(new RegExp(digits[0] + '+', 'g'), digits[0]);
  return result;
}

/** 转换 4 位节。padTo4 为 true 时按 4 位补零处理（非最高节） */
function convertSection(sec: number, digits: string[], units: string[], padTo4: boolean): string {
  const raw = padTo4 ? String(sec).padStart(4, '0') : String(sec);
  const arr = raw.split('').map(Number);
  const len = arr.length;
  let out = '';
  let zeroPending = false;
  for (let i = 0; i < len; i++) {
    const d = arr[i];
    const unitIdx = len - 1 - i;
    if (d === 0) {
      zeroPending = true;
    } else {
      if (zeroPending) {
        out += digits[0];
        zeroPending = false;
      }
      out += digits[d] + units[unitIdx];
    }
  }
  return out;
}

/** 将中文数字转为阿拉伯数字 */
export function fromChineseNumber(chinese: string): number {
  if (chinese.length === 0) {
    throw new TypeError('fromChineseNumber: 输入不能为空');
  }
  let s = chinese.trim();
  let negative = false;
  if (s.startsWith('负') || s.startsWith('-')) {
    negative = true;
    s = s.slice(1);
  }
  if (s.length === 0) {
    throw new TypeError('fromChineseNumber: 输入无效');
  }

  // 分离小数部分
  let intStr = s;
  let decStr = '';
  const dotIdx = s.indexOf('点');
  if (dotIdx >= 0) {
    intStr = s.slice(0, dotIdx);
    decStr = s.slice(dotIdx + 1);
  }

  const intValue = parseInteger(intStr);
  let decValue = 0;
  if (decStr.length > 0) {
    let decDigits = '';
    for (const ch of decStr) {
      const v = CN_DIGIT_MAP[ch];
      if (v === undefined) {
        throw new TypeError('fromChineseNumber: 无效小数字符 ' + ch);
      }
      decDigits += v;
    }
    if (decDigits.length > 0) decValue = Number('0.' + decDigits);
  }

  const result = intValue + decValue;
  return negative ? -result : result;
}

/** 解析中文整数 */
function parseInteger(s: string): number {
  let total = 0; // 累计总数
  let section = 0; // 当前节（万/亿以内）
  let current = 0; // 当前正在累积的数值

  for (const ch of s) {
    const digit = CN_DIGIT_MAP[ch];
    if (digit !== undefined) {
      current = digit;
      continue;
    }
    const unit = CN_UNIT_MAP[ch];
    if (unit !== undefined) {
      if (unit >= 10000) {
        // 节单位：万/亿
        section += current;
        total += (section === 0 ? 1 : section) * unit;
        section = 0;
        current = 0;
      } else {
        // 内部单位：十/百/千
        if (current === 0) current = 1; // 处理"十"省略"一"
        section += current * unit;
        current = 0;
      }
      continue;
    }
    throw new TypeError('fromChineseNumber: 无效字符 ' + ch);
  }
  // 收尾
  section += current;
  total += section;
  return total;
}