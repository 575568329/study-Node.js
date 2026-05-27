#!/usr/bin/env node
/**
 * Gemini CLI - 轻量版，直接调用智谱 API 模拟 Gemini 协作
 * 用法: node tools/gemini/gemini-cli.mjs <mode> "问题"
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DIR = import.meta.dirname;
const CONTEXT_FILE = join(DIR, 'api-context.json');
const API_KEY = process.env.ANTHROPIC_AUTH_TOKEN || 'd67410b5e1964c23a799e83acaabff89.Nwe6IqBFrC7vVFiN';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL = 'glm-4-flash';

const SYSTEM_PROMPT = `你是全栈开发学习策略师。

## 学生背景
- 6年前端经验，Vue2精通，正在扩展全栈能力
- 目标：全栈工程师（Node.js / React / Next.js / AI 应用方向）
- 约1个月后求职，需快速转型 AI 应用开发方向
- 学习风格：实践导向，喜欢自己写代码，深度思考型

## 输出原则
- 简明扼要，不要废话
- 指出关键风险点（哪些不能写进简历）
- 给出可操作的下一步建议
- 用中文回答`;

const MODES = {
  ask: '通用',
  verify: '验证',
  quiz: '盲区',
  interview: '面试',
};

const MODE_PROMPTS = {
  verify: '请以严格的审查视角评估以下教学内容。指出：1) 不准确的地方 2) 遗漏的关键点 3) 面试风险（哪些说法经不起追问）。格式：分点列出，每点标注严重程度（高/中/低）。',
  quiz: '请根据已学主题出 3-5 道测试题，从基础到深入递进，覆盖常见误区和边界情况。不给答案。',
  interview: '请模拟真实技术面试追问。从概念 → 原理 → 场景 → 陷阱递进。每次只问一个问题。评估回答深度，给出加分建议。',
};

function loadContext() {
  try {
    return JSON.parse(readFileSync(CONTEXT_FILE, 'utf-8'));
  } catch {
    return { messages: [], updated_at: new Date().toISOString() };
  }
}

function saveContext(ctx) {
  writeFileSync(CONTEXT_FILE, JSON.stringify(ctx, null, 2), 'utf-8');
}

async function callAPI(userMessage, mode) {
  const ctx = loadContext();
  const modeLabel = MODES[mode] || '通用';
  const modeInstruction = MODE_PROMPTS[mode] || '';

  const systemMessage = `${SYSTEM_PROMPT}\n\n当前模式：${modeLabel}模式。${modeInstruction}`;

  const messages = [
    { role: 'system', content: systemMessage },
    ...ctx.messages.slice(-10), // 保留最近10轮
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: mode === 'verify' ? 0.1 : 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${err.substring(0, 200)}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || '[无回复]';

  // 保存上下文
  ctx.messages.push(
    { role: 'user', content: userMessage.substring(0, 500), timestamp: new Date().toISOString() },
    { role: 'assistant', content: reply.substring(0, 1000), timestamp: new Date().toISOString() },
  );
  if (ctx.messages.length > 20) ctx.messages = ctx.messages.slice(-20);
  ctx.updated_at = new Date().toISOString();
  saveContext(ctx);

  return reply;
}

// ── Main ──
const action = process.argv[2];
const prompt = process.argv.slice(3).join(' ');

if (!action || !prompt) {
  console.log(`
Gemini CLI - 轻量版（智谱 API）

  node tools/gemini/gemini-cli.mjs ask "问题"          直接提问
  node tools/gemini/gemini-cli.mjs verify "内容"       验证教学内容
  node tools/gemini/gemini-cli.mjs quiz "主题"         出题测试
  node tools/gemini/gemini-cli.mjs interview "主题"    面试模拟
  node tools/gemini/gemini-cli.mjs clear               清除对话上下文

  自动保持对话上下文（最近 10 轮）
  `);
  process.exit(0);
}

if (action === 'clear') {
  saveContext({ messages: [], updated_at: new Date().toISOString() });
  console.log('对话上下文已清除');
  process.exit(0);
}

console.log(`[${MODES[action] || action}] ${prompt}\n`);

try {
  const reply = await callAPI(prompt, action);
  console.log('=== 回复 ===\n');
  console.log(reply);
  console.log('\n=== 结束 ===');
} catch (err) {
  console.error('调用失败:', err.message);
  process.exit(1);
}
