/* 生成算法问答(Q&A) Markdown 模板的脚本 */

import fs from "fs";
import path from "path";

function getDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`错误: 未提供文件名参数\n用法: pnpm new-qna <filename>`);
  process.exit(1);
}

let fileName = args[0];
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) fileName += ".md";

const targetDir = "./src/content/qna/";
const fullPath = path.resolve(targetDir, fileName);

if (fs.existsSync(fullPath)) {
  console.error(`错误: 文件 ${fullPath} 已存在`);
  process.exit(1);
}

const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

const title = fileName.replace(fileExtensionRegex, "");
const today = getDate();
const tpl = `---\n` +
`title: ${title}\n` +
`published: ${today}\n` +
`updated: ${today}\n` +
`description: ''\n` +
`image: ''\n` +
`tags: [Q&A]\n` +
`category: Q&A\n` +
`pinned: false\n` +
`draft: false\n` +
`---\n\n` +
`## 问题\n` +
`在这里写题目描述或面试问题。可嵌入数学公式，如 $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$.\n\n` +
`## 思路\n` +
`- 关键点 1\n` +
`- 关键点 2\n` +
`- 边界/坑点\n\n` +
`## 证明 / 推导（可选）\n` +
`$$\n\\text{示例：}\\quad T(n) = 2T(\\tfrac{n}{2}) + n \Rightarrow T(n) = n \\log n\n$$\n\n` +
`## 复杂度\n` +
`- 时间：O(?)\n` +
`- 空间：O(?)\n\n` +
`## 代码\n` +
"```cpp\n// C++ 实现\n#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  ios::sync_with_stdio(false); cin.tie(nullptr);\n  // ...\n  return 0;\n}\n```\n\n" +
`## 示例 / 用例（可选）\n` +
"```text\n输入: ...\n输出: ...\n```\n\n" +
`## 附图（可选）\n` +
`将图片放在与本文相同目录，使用相对路径：\n` +
`![示意图](./example.png)\n`;

fs.writeFileSync(fullPath, tpl);
console.log(`Q&A 文件已创建: ${fullPath}`);
