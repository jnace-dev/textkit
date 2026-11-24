# textkit

> TypeScript 文本算法工具库 · 零依赖 · 开源可商用

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue.svg)](https://www.typescriptlang.org/)
[![tests](https://img.shields.io/badge/tests-100%2B-passing-green.svg)](https://gitee.com/textkit/textkit)

`textkit` 是一个面向开源场景的纯 TypeScript **文本算法工具库**，覆盖前缀树、敏感词过滤、字符串匹配、编辑距离、文本相似度、命名格式转换、中文数字转换等常见需求。所有实现均为**零依赖**原生 TS，可在 Node.js、浏览器及任意构建工具链中直接使用。

---

## 目录

- [特性](#特性)
- [安装](#安装)
- [快速上手](#快速上手)
- [API 文档](#api-文档)
  - [Trie 前缀树](#trie-前缀树)
  - [SensitiveFilter 敏感词过滤](#sensitivefilter-敏感词过滤)
  - [Levenshtein 编辑距离](#levenshtein-编辑距离)
  - [KMP 字符串匹配](#kmp-字符串匹配)
  - [文本相似度](#文本相似度)
  - [命名格式转换](#命名格式转换)
  - [中文数字转换](#中文数字转换)
- [项目结构](#项目结构)
- [开发与测试](#开发与测试)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 特性

- **零依赖**：纯 TypeScript 实现，无第三方运行时依赖
- **Tree Shaking 友好**：按需引入，只打包用到的模块
- **类型完备**：全量 TypeScript 类型声明，IDE 友好
- **测试覆盖**：100+ 单元测试，覆盖核心分支与边界
- **开源可商用**：MIT 协议，Gitee 托管

---

## 安装

```bash
npm install textkit
```

或通过 CDN 直接引入：

```html
<script type="module">
  import { Trie } from 'https://esm.sh/textkit@1/index.mjs';
</script>
```

---

## 快速上手

```ts
import { Trie, SensitiveFilter, levenshteinSimilarity, toChineseNumber } from 'textkit';

// 1. 前缀树
const trie = new Trie();
trie.insertAll(['apple', 'application', 'banana']);
trie.autocomplete('app'); // ['apple', 'application']

// 2. 敏感词过滤
const filter = new SensitiveFilter();
filter.addWords(['暴力', '毒品']);
filter.replace('这是暴力内容'); // 这是**内容

// 3. 编辑距离相似度
levenshteinSimilarity('kitten', 'sitting'); // 0.571...

// 4. 中文数字转换
toChineseNumber(12345); // 一万二千三百四十五
toChineseNumber(12345, { uppercase: true }); // 壹万贰仟叁佰肆拾伍
```

---

## API 文档

### Trie 前缀树

```ts
import { Trie } from 'textkit';

const trie = new Trie({ caseSensitive: false });

trie.insert('hello');
trie.insertAll(['world', 'hello world']);

trie.search('hello');      // true
trie.startsWith('hel');    // true
trie.autocomplete('he');   // ['hello']
trie.delete('hello');      // true
trie.size;                 // 2
trie.toArray();            // ['world', 'hello world']
trie.clear();
```

### SensitiveFilter 敏感词过滤

```ts
import { SensitiveFilter } from 'textkit';

const filter = new SensitiveFilter({ replaceChar: '*' });
filter.addWords(['暴力', '毒品', '赌博']);

filter.has('禁止暴力行为');          // true
filter.findAll('暴力与赌博');        // [{word:'暴力',...},{word:'赌博',...}]
filter.replace('暴力与赌博');        // '**与**'
filter.count('暴力与赌博');          // 2
```

### Levenshtein 编辑距离

```ts
import { editDistance, editDistanceWithOps, levenshteinSimilarity } from 'textkit';

editDistance('kitten', 'sitting');            // 3
levenshteinSimilarity('kitten', 'sitting');   // 0.571...

editDistanceWithOps('kitten', 'sitting');
// { distance: 3, ops: [{op:'replace',...}, ...] }
```

### KMP 字符串匹配

```ts
import { kmpSearch, kmpContains, kmpCount } from 'textkit';

kmpSearch('ababcabcab', 'abc'); // [2, 5]
kmpContains('hello', 'ell');    // true
kmpCount('aaaa', 'aa');         // 3
```

### 文本相似度

```ts
import {
  jaccardSimilarity,
  cosineSimilarity,
  diceCoefficient,
  editSimilarity,
  combinedSimilarity,
} from 'textkit';

jaccardSimilarity('hello', 'hello');   // 1
cosineSimilarity('abc', 'abc');        // 1
diceCoefficient('abc', 'abd');         // 0.666...
editSimilarity('kitten', 'sitting');   // 0.571...
combinedSimilarity('abc', 'abd');      // 加权平均
```

### 命名格式转换

```ts
import { toAllCases, toCamelCase, toKebabCase } from 'textkit';

toCamelCase('hello-world');   // helloWorld
toKebabCase('HelloWorld');    // hello-world
toAllCases('hello world');
// { camel:'helloWorld', pascal:'HelloWorld', kebab:'hello-world',
//   snake:'hello_world', screaming:'HELLO_WORLD',
//   title:'Hello World', sentence:'hello world' }
```

### 中文数字转换

```ts
import { toChineseNumber, fromChineseNumber } from 'textkit';

toChineseNumber(12345);                    // 一万二千三百四十五
toChineseNumber(12345, { uppercase: true });// 壹万贰仟叁佰肆拾伍
toChineseNumber(0);                        // 零
toChineseNumber(-100000);                  // negative十万

fromChineseNumber('一万二千三百四十五');    // 12345
fromChineseNumber('壹万贰仟叁佰肆拾伍');    // 12345
fromChineseNumber('负十万');                // -100000
```

---

## 项目结构

```
textkit/
├── src/
│   ├── index.ts              # 统一入口
│   ├── types.ts              # 公共类型
│   ├── data/
│   │   └── chinese-number.ts # 中文数字字面量表
│   ├── structure/
│   │   └── trie.ts           # Trie 前缀树
│   ├── filter/
│   │   └── sensitive.ts      # 敏感词过滤器
│   ├── string/
│   │   ├── levenshtein.ts    # 编辑距离
│   │   ├── kmp.ts            # KMP 匹配
│   │   ├── similarity.ts     # 文本相似度
│   │   └── format.ts         # 命名格式转换
│   └── convert/
│       └── chinese-number.ts # 中文数字转换
├── tests/                    # 单元测试
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 开发与测试

```bash
# 安装依赖
npm install

# 类型检查
npm run typecheck

# 运行全部测试
npm test

# 监听模式
npm run test:watch

# 构建
npm run build
```

---

## 贡献指南

欢迎提交 Issue 与 Pull Request。贡献前请：

1. 确保 `npm test` 全部通过
2. 新增功能请附带对应单元测试
3. 保持零依赖原则，不引入运行时第三方库
4. 遵循现有代码风格（TypeScript strict 模式）

---

## 许可证

本项目基于 [MIT 协议](LICENSE) 开源，可免费用于商业场景。