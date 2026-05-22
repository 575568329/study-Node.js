import { chromium } from 'playwright';
import { execSync, spawn } from 'child_process';
import { readFileSync, appendFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const CDP_PORT = 19222;
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];
function findChrome() {
  for (const p of CHROME_PATHS) { try { require('fs').accessSync(p); return p; } catch {} }
  return 'chrome';
}
const CHROME_PATH = findChrome();
const USER_DATA = join(import.meta.dirname, '.chrome-profile');
const PROJECT_ROOT = join(import.meta.dirname, '..');
const INTERACTIONS_DIR = join(PROJECT_ROOT, 'gemini-interactions');
const SYSTEM_PROMPT_FILE = join(PROJECT_ROOT, 'docs', 'gemini-system-prompt.md');
const GEM_NAME = '全栈学习策略师';
const GEMS_URL = 'https://gemini.google.com/gems';

const MODES = {
  plan: '规划',
  verify: '验证',
  quiz: '盲区',
  interview: '面试',
};

async function main() {
  const action = process.argv[2];

  switch (action) {
    case 'open': return openGemini();
    case 'setup': return setupGem();
    case 'ask': return askGemini('ask', process.argv.slice(3).join(' '));
    case 'plan': return askGemini('plan', process.argv.slice(3).join(' '));
    case 'verify': return askGemini('verify', process.argv.slice(3).join(' '));
    case 'quiz': return askGemini('quiz', generateQuizPrompt());
    case 'interview': return askGemini('interview', generateInterviewPrompt(process.argv.slice(3).join(' ')));
    case 'read': return readResponse();
    case 'close': return closeBrowser();
    default: printHelp();
  }
}

function printHelp() {
  console.log(`
Gemini 学习协作工具 - 双 AI 学习系统

  node tools/gemini-chat.mjs open              启动 Chrome 调试模式
  node tools/gemini-chat.mjs setup             配置 Gemini Gem（首次使用）
  node tools/gemini-chat.mjs ask "问题"         直接提问
  node tools/gemini-chat.mjs plan "问题"        规划模式：学习路径建议
  node tools/gemini-chat.mjs verify "内容"      验证模式：审查教学内容
  node tools/gemini-chat.mjs quiz               盲区模式：出题测试
  node tools/gemini-chat.mjs interview "主题"   面试模式：模拟追问
  node tools/gemini-chat.mjs read              读取最新回复
  node tools/gemini-chat.mjs close             关闭浏览器

  所有交互自动保存到 gemini-interactions/YYYY-MM-DD.md
`);
}

// ── Connection helpers ────────────────────────
async function connectCDP() {
  for (let i = 0; i < 30; i++) {
    try {
      return await chromium.connectOverCDP(`http://localhost:${CDP_PORT}`);
    } catch {
      if (i === 5) console.log('  等待 Chrome...');
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.error('Error: 无法连接 Chrome。先执行: node tools/gemini-chat.mjs open');
  process.exit(1);
}

async function getGeminiPage(browser) {
  for (const ctx of browser.contexts()) {
    for (const page of ctx.pages()) {
      if (page.url().includes('gemini.google.com')) return page;
    }
  }
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0];
  if (page) {
    await page.goto('https://gemini.google.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    return page;
  }
  return null;
}

// ── Open ──────────────────────────────────────
async function openGemini() {
  console.log('关闭现有 Chrome...');
  try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {}
  await new Promise(r => setTimeout(r, 5000));

  console.log('启动 Chrome 调试模式...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--start-maximized',
    'https://gemini.google.com/',
  ], { detached: true, stdio: 'ignore' });
  chrome.unref();

  const browser = await connectCDP();
  const page = await getGeminiPage(browser);
  if (page) console.log(`页面: ${await page.title()}`);

  console.log('');
  console.log('=== Chrome 已启动 ===');
  console.log('登录后可使用: node tools/gemini-chat.mjs <command>');

  await browser.close();
}

// ── Setup Gem ─────────────────────────────────
async function setupGem() {
  const systemPrompt = readFileSync(SYSTEM_PROMPT_FILE, 'utf-8');
  // Extract just the instruction part (after the divider)
  const instructionStart = systemPrompt.indexOf('你是全栈开发学习策略师');
  if (instructionStart === -1) {
    console.error('Error: 系统指令文件格式错误');
    process.exit(1);
  }
  const instructions = systemPrompt.substring(instructionStart).trim();

  console.log('连接 Chrome...');
  const browser = await connectCDP();
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();

  try {
    console.log('导航到 Gemini Gems 页面...');
    await page.goto(GEMS_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Check if we're on the gems page
    if (!page.url().includes('gemini.google.com')) {
      console.error('Error: 未登录 Gemini。先执行 open 命令登录。');
      await browser.close();
      process.exit(1);
    }

    // Look for "New Gem" or "Create" button
    console.log('寻找创建 Gem 按钮...');
    const createBtn = await findButton(page, ['New Gem', '新建 Gem', 'Create', '创建', 'Add']);
    if (!createBtn) {
      console.log('未找到创建按钮。可能 Gem 页面结构已变化。');
      console.log('请手动创建 Gem：');
      console.log(`  名称: ${GEM_NAME}`);
      console.log(`  指令文件: docs/gemini-system-prompt.md`);
      await page.screenshot({ path: join(PROJECT_ROOT, 'tmp', 'gems-page-debug.png') });
      console.log('页面截图已保存到 gemini-interactions/gems-page-debug.png');
      await browser.close();
      return;
    }

    await createBtn.click();
    await page.waitForTimeout(2000);

    // Fill in Gem name
    console.log('填写 Gem 名称...');
    const nameInput = await findInputField(page);
    if (nameInput) {
      await nameInput.fill(GEM_NAME);
      await page.waitForTimeout(500);
    }

    // Fill in instructions - find the textarea/contenteditable for instructions
    console.log('填写系统指令...');
    const instructionInputs = await page.$$('textarea, div[contenteditable="true"]');
    // Usually the second input is the instruction field
    for (const input of instructionInputs) {
      const text = await input.innerText().catch(() => '');
      const placeholder = await input.getAttribute('placeholder').catch(() => '');
      if (text === '' || placeholder.toLowerCase().includes('instruction') || placeholder.includes('指令')) {
        await input.click();
        await input.fill('');
        await input.type(instructions, { delay: 5 });
        break;
      }
    }

    await page.waitForTimeout(1000);

    // Save the Gem
    console.log('保存 Gem...');
    const saveBtn = await findButton(page, ['Save', '保存', 'Create', '创建', 'Done']);
    if (saveBtn) {
      await saveBtn.click();
      console.log(`Gem "${GEM_NAME}" 创建成功！`);
    } else {
      console.log('请手动点击保存按钮完成创建');
    }

    await page.screenshot({ path: join(PROJECT_ROOT, 'tmp', 'gem-created.png') });
    console.log('截图已保存到 gemini-interactions/gem-created.png');

  } finally {
    await browser.close();
  }
}

// ── Context Management ───────────────────────
const CONTEXT_FILE = join(PROJECT_ROOT, 'gemini-interactions', 'context.json');

const DEFAULT_CONTEXT = {
  session_id: `sess_${Date.now()}`,
  updated_at: new Date().toISOString(),
  stage: '面试准备',
  milestones: [],
  rolling_window: [],
  mode_urls: {},  // mode → last conversation URL for reuse
};

function loadContext() {
  try {
    const saved = JSON.parse(readFileSync(CONTEXT_FILE, 'utf-8'));
    return { ...DEFAULT_CONTEXT, ...saved };
  } catch {
    return { ...DEFAULT_CONTEXT };
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      result[key] = source[key];
    } else if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = { ...(target[key] || {}), ...source[key] };
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function saveContext(updates) {
  const current = loadContext();
  const ctx = deepMerge(current, { ...updates, updated_at: new Date().toISOString() });
  if (!existsSync(INTERACTIONS_DIR)) mkdirSync(INTERACTIONS_DIR, { recursive: true });
  writeFileSync(CONTEXT_FILE, JSON.stringify(ctx, null, 2), 'utf-8');
}

function buildContextEnvelope(mode, userPrompt) {
  const ctx = loadContext();
  const modeLabel = MODES[mode] || '通用';

  // Keep it short: just question + brief context footer
  // Long context causes fill/type issues with contenteditable
  const lastTurn = ctx.rolling_window && ctx.rolling_window.length > 0
    ? ctx.rolling_window[ctx.rolling_window.length - 1]
    : null;

  const contextFooter = lastTurn
    ? `\n\n[背景：${modeLabel}模式 | 阶段：${ctx.stage} | 上轮要点：${lastTurn.summary.substring(0, 120)}]`
    : `\n\n[背景：${modeLabel}模式 | 阶段：${ctx.stage}]`;

  return userPrompt + contextFooter;
}

async function ensureConversation(page, mode) {
  const ctx = loadContext();
  const savedUrl = ctx.mode_urls && ctx.mode_urls[mode];

  if (savedUrl) {
    console.log(`尝试复用对话: ${savedUrl}`);
    try {
      await page.goto(savedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      // Verify we landed on a valid conversation page
      if (page.url().includes('gemini.google.com')) {
        const inputEl = await findInput(page);
        if (inputEl) {
          console.log('复用对话成功');
          return;
        }
      }
    } catch {}
    console.log('复用失败，发起新对话');
  }

  // Start fresh
  console.log('发起新对话...');
  await page.goto('https://gemini.google.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  const newChatBtn = await findButton(page, ['New chat', '新对话', 'New conversation', '发起新对话']);
  if (newChatBtn) {
    await newChatBtn.click();
    await page.waitForTimeout(1500);
  }
}

// ── Ask (core command) ────────────────────────
async function askGemini(mode, prompt) {
  if (!prompt) {
    console.error('Error: 缺少问题。用法: node tools/gemini-chat.mjs <mode> "你的问题"');
    process.exit(1);
  }

  const browser = await connectCDP();
  const page = await getGeminiPage(browser);

  if (!page) {
    console.error('Error: 未找到 Gemini 页面');
    await browser.close();
    process.exit(1);
  }

  try {
    // Reuse existing conversation or start fresh
    await ensureConversation(page, mode);

    // Build context envelope
    const fullPrompt = buildContextEnvelope(mode, prompt);

    console.log(`[${mode.toUpperCase()}] ${prompt}`);

    // Try to use Gem first - look for Gem selector
    const gemSelected = await trySelectGem(page);
    if (gemSelected) {
      console.log('已选择学习策略师 Gem');
    }

    // Wait for input to be truly ready (retry up to 5 times)
    let inputEl = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      inputEl = await findInput(page);
      if (inputEl) {
        const isVisible = await inputEl.isVisible().catch(() => false);
        if (isVisible) break;
      }
      console.log(`输入框未就绪，重试 ${attempt + 1}/5...`);
      await page.waitForTimeout(2000);
    }

    if (!inputEl) {
      const text = await page.innerText('body').catch(() => '');
      console.error('未找到输入框。页面文本前300字:');
      console.error(text.substring(0, 300));
      return;
    }

    // Record current response count to detect NEW response later
    const preCount = await page.evaluate(() => {
      return document.querySelectorAll('model-response, div[class*="message-content"]').length;
    }).catch(() => 0);

    // Input and send: keyboard.type is most reliable for contenteditable
    await inputEl.click();
    await page.waitForTimeout(300);
    await page.keyboard.type(fullPrompt, { delay: 15 });
    await page.waitForTimeout(800);
    await page.keyboard.press('Enter');
    console.log('已发送，等待回复...');

    // Wait for NEW response to appear and finish streaming
    // Strategy: wait for response count to increase, then wait for streaming to stop
    let newResponseAppeared = false;
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      const currentCount = await page.evaluate(() => {
        return document.querySelectorAll('model-response, div[class*="message-content"]').length;
      }).catch(() => preCount);
      if (currentCount > preCount) {
        newResponseAppeared = true;
        console.log('检测到新回复，等待流式输出完成...');
        break;
      }
      if (i % 5 === 4) console.log(`  等待新回复... (${i + 1}s)`);
    }

    if (!newResponseAppeared) {
      console.log('警告：未检测到新回复，可能消息未发送成功');
    }

    // Wait for streaming to complete: monitor text length stability
    let prevLen = 0;
    let stableCount = 0;
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(1000);
      const curLen = await page.evaluate(() => {
        const els = document.querySelectorAll('model-response, div[class*="message-content"]');
        if (els.length === 0) return 0;
        return els[els.length - 1].innerText.length;
      }).catch(() => 0);

      if (curLen === prevLen && curLen > 0) {
        stableCount++;
        if (stableCount >= 3) {
          console.log(`回复完成 (${curLen} 字)`);
          break;
        }
      } else {
        stableCount = 0;
        prevLen = curLen;
      }
      if (i % 10 === 9) console.log(`  等待输出完成... (${curLen} 字)`);
    }

    const response = await extractResponse(page);
    console.log('\n=== Gemini 回复 ===\n');
    console.log(response);
    console.log('\n=== 回复结束 ===');

    // Auto-save interaction
    saveInteraction(mode, prompt, response);

    // Update context: rolling window + save conversation URL
    const ctx = loadContext();
    const rolling = ctx.rolling_window || [];
    let summary = response.replace(/\s+/g, ' ');
    if (summary.length > 600) summary = summary.substring(0, 600) + '...(下略)';
    rolling.push({ query: prompt.substring(0, 150), summary });
    if (rolling.length > 3) rolling.shift();

    const currentUrl = page.url();
    const modeUrls = { ...(ctx.mode_urls || {}) };
    if (currentUrl.includes('gemini.google.com')) modeUrls[mode] = currentUrl;

    saveContext({ rolling_window: rolling, mode_urls: modeUrls });
    console.log('上下文已更新');

  } finally {
    await browser.close();
  }
}

// ── Read ──────────────────────────────────────
async function readResponse() {
  const browser = await connectCDP();
  const page = await getGeminiPage(browser);
  if (!page) { console.error('未找到 Gemini 页面'); await browser.close(); return; }

  const response = await extractResponse(page);
  console.log('\n=== Gemini 最新回复 ===\n');
  console.log(response);
  console.log('\n=== 回复结束 ===');
  await browser.close();
}

// ── Close ─────────────────────────────────────
async function closeBrowser() {
  try { const b = await connectCDP(); await b.close(); } catch {}
  try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {}
  console.log('Chrome 已关闭');
}

// ── Interaction Saving ────────────────────────
function saveInteraction(mode, question, response) {
  if (!existsSync(INTERACTIONS_DIR)) mkdirSync(INTERACTIONS_DIR, { recursive: true });

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().substring(0, 5);
  const filePath = join(INTERACTIONS_DIR, `${dateStr}.md`);

  const modeLabel = MODES[mode] || '通用';
  const entry = `
## [${timeStr}] 模式：${modeLabel}

**问题**: ${question}

**Gemini 回复**:
> ${response.replace(/\n/g, '\n> ')}

---

`;

  if (existsSync(filePath)) {
    appendFileSync(filePath, entry);
  } else {
    writeFileSync(filePath, `# ${dateStr} Gemini 交互记录\n${entry}`);
  }

  console.log(`\n已保存到 gemini-interactions/${dateStr}.md`);
}

// ── Mode-specific prompt generators ──────────
function generateQuizPrompt() {
  return `请根据我已学的 Node.js 基础（事件循环、Stream、HTTP、异步编程、错误处理）出3-5道测试题，从基础到深入递进，覆盖常见误区。不要给答案。`;
}

function generateInterviewPrompt(topic) {
  const t = topic || 'Node.js 全栈';
  return `请模拟 Node.js 全栈工程师面试，主题是"${t}"。从概念开始，逐步深入追问原理、场景、陷阱。每次只问一个问题，等我回答后再追问下一个。`;
}

// ── Page interaction helpers ──────────────────
async function findInput(page) {
  const selectors = [
    'rich-textarea div[contenteditable="true"]',
    'div[contenteditable="true"][aria-label]',
    'div[contenteditable="true"]',
    'textarea',
  ];
  for (const sel of selectors) {
    const el = await page.$(sel);
    if (el) return el;
  }
  return null;
}

async function findButton(page, labels) {
  for (const label of labels) {
    const btn = await page.$(`button:has-text("${label}"), a:has-text("${label}")`);
    if (btn && await btn.isVisible().catch(() => false)) return btn;
  }
  return null;
}

async function findInputField(page) {
  const inputs = await page.$$('input[type="text"], input:not([type]), textarea');
  for (const input of inputs) {
    const visible = await input.isVisible().catch(() => false);
    if (visible) return input;
  }
  return null;
}

async function trySelectGem(page) {
  try {
    // Strategy A: find Gem link by href + text match
    const gemLinks = await page.$$('a[href*="/gem/"], a[href*="/app/gem/"]');
    for (const link of gemLinks) {
      const text = await link.innerText().catch(() => '');
      const aria = await link.getAttribute('aria-label').catch(() => '');
      if (text.includes(GEM_NAME) || (aria && aria.includes(GEM_NAME))) {
        await link.click();
        await page.waitForTimeout(1500);
        console.log(`[Gem] 策略A命中，已选择 ${GEM_NAME}`);
        return true;
      }
    }

    // Strategy B: XPath fallback
    try {
      const [xpathEl] = await page.$x(`//a[contains(@aria-label, "${GEM_NAME}")] | //div[contains(text(), "${GEM_NAME}")]/ancestor::a`);
      if (xpathEl) {
        await xpathEl.click();
        await page.waitForTimeout(1500);
        console.log(`[Gem] 策略B(XPath)命中`);
        return true;
      }
    } catch {}

    // Strategy C: open model selector dropdown and search
    const modelSelector = await page.$('button[aria-label*="Model"], button[aria-label*="模型"], button[aria-label*="Gem"]');
    if (modelSelector) {
      await modelSelector.click();
      await page.waitForTimeout(1000);
      const options = await page.$$('[role="option"], [role="menuitem"]');
      for (const opt of options) {
        const text = await opt.innerText().catch(() => '');
        if (text.includes(GEM_NAME)) {
          await opt.click();
          await page.waitForTimeout(1500);
          console.log(`[Gem] 策略C(下拉菜单)命中`);
          return true;
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function extractResponse(page) {
  return page.evaluate(() => {
    // Tier 1: stable semantic selectors
    const stableSelectors = [
      'div[class*="message-content"]',
      'div[class*="model-outputs"]',
      'model-response',
    ];
    for (const sel of stableSelectors) {
      const els = document.querySelectorAll(sel);
      if (els.length > 0) {
        const last = els[els.length - 1];
        const text = last.innerText.trim();
        if (text.length > 10) return text;
      }
    }

    // Tier 2: find last meaningful text block in main content
    const containers = document.querySelectorAll('main div, [role="main"] div');
    for (let i = containers.length - 1; i >= 0; i--) {
      const text = containers[i].innerText || '';
      if (text.length > 100 && !containers[i].querySelector('textarea, input')) {
        if (containers[i].children.length < 10) return text.trim();
      }
    }

    // Tier 3: full main content (no hard truncation)
    const main = document.querySelector('main') || document.body;
    return main.innerText.trim();
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
