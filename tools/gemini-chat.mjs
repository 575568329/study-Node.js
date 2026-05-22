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
    // If mode is specific, prefix the prompt
    const fullPrompt = mode !== 'ask' && MODES[mode]
      ? `[${MODES[mode]}模式] ${prompt}`
      : prompt;

    console.log(`[${mode.toUpperCase()}] ${prompt}`);

    // Try to use Gem first - look for Gem selector
    const gemSelected = await trySelectGem(page);
    if (gemSelected) {
      console.log('已选择学习策略师 Gem');
    }

    const inputEl = await findInput(page);
    if (!inputEl) {
      const text = await page.innerText('body').catch(() => '');
      console.error('未找到输入框。页面文本前300字:');
      console.error(text.substring(0, 300));
      return;
    }

    await inputEl.click();
    await inputEl.fill('');
    await page.waitForTimeout(300);
    await inputEl.type(fullPrompt, { delay: 25 });
    await page.waitForTimeout(800);

    await inputEl.press('Enter');
    console.log('已发送，等待回复...');

    // Wait for response
    await page.waitForTimeout(4000);
    let waited = 0;
    while (waited < 120) {
      await page.waitForTimeout(1000);
      waited++;
      const generating = await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label*="Stop"], button[aria-label*="stop"]');
        return btn ? btn.offsetParent !== null : false;
      }).catch(() => false);

      if (!generating && waited > 5) {
        await page.waitForTimeout(2000);
        break;
      }
      if (waited % 10 === 0) console.log(`  等待中... (${waited}s)`);
    }

    const response = await extractResponse(page);
    console.log('\n=== Gemini 回复 ===\n');
    console.log(response);
    console.log('\n=== 回复结束 ===');

    // Auto-save interaction
    saveInteraction(mode, prompt, response);

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
    // Look for Gem selector / dropdown
    const gemBtn = await page.$(`[data-gem-name*="${GEM_NAME}"], button:has-text("${GEM_NAME}"), [role="option"]:has-text("${GEM_NAME}"), [role="menuitem"]:has-text("${GEM_NAME}")`);
    if (gemBtn && await gemBtn.isVisible().catch(() => false)) {
      await gemBtn.click();
      await page.waitForTimeout(1000);
      return true;
    }

    // Try opening model selector
    const modelSelector = await page.$('button[aria-label*="Model"], button[aria-label*="模型"]');
    if (modelSelector) {
      await modelSelector.click();
      await page.waitForTimeout(1000);
      const gemOption = await page.$(`[data-value*="${GEM_NAME}"], [role="option"]:has-text("${GEM_NAME}")`);
      if (gemOption) {
        await gemOption.click();
        await page.waitForTimeout(1000);
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function extractResponse(page) {
  return page.evaluate(() => {
    const selectors = [
      'model-response',
      '.model-response-text',
      'message-content',
      '.response-container-content',
    ];
    for (const sel of selectors) {
      const containers = document.querySelectorAll(sel);
      if (containers.length > 0) return containers[containers.length - 1].innerText;
    }
    const fallbacks = document.querySelectorAll(
      '.conversation-container message-content, [data-message-id] .markdown, .message-content'
    );
    if (fallbacks.length > 0) return fallbacks[fallbacks.length - 1].innerText;
    return document.body.innerText.substring(0, 3000) + '\n[未找到结构化回复]';
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
