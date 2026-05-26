import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

// ── Config ─────────────────────────────────────
const CDP_PORT = 19222;
const DIR = import.meta.dirname;
const INTERACTIONS_DIR = DIR;
const CONTEXT_FILE = join(DIR, 'context.json');
const COOKIE_CACHE = join(DIR, '.gemini-cookies.txt');
const AT_TOKEN_CACHE = join(DIR, '.gemini-at-token.txt');

const STREAM_URL = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
const ROTATE_URL = 'https://accounts.google.com/RotateCookies';

// Model headers - switch between models
// 3.5 Flash (from browser): 56fdd199312815e2
// 3.1 Flash: fbb127bbb056c959
// 3.1 Pro: 9d8ca3786ebdfbea
const MODEL_IDS = {
  'flash35': '56fdd199312815e2',
  'flash': 'fbb127bbb056c959',
  'pro': '9d8ca3786ebdfbea',
};
const CURRENT_MODEL = process.env.GEMINI_MODEL || 'flash35';

function buildModelHeader(modelId) {
  return `[1,null,null,null,"${modelId}",null,null,0,[4,5,6,8],null,null,2,null,null,1,1,null]`;
}

const MODES = {
  plan: '规划',
  verify: '验证',
  quiz: '盲区',
  interview: '面试',
};

// ── Main ────────────────────────────────────────
async function main() {
  const action = process.argv[2];

  switch (action) {
    case 'init': return initCookies();
    case 'ask': return askGemini('ask', process.argv.slice(3).join(' '));
    case 'plan': return askGemini('plan', process.argv.slice(3).join(' '));
    case 'verify': return askGemini('verify', process.argv.slice(3).join(' '));
    case 'quiz': return askGemini('quiz', generateQuizPrompt());
    case 'interview': return askGemini('interview', generateInterviewPrompt(process.argv.slice(3).join(' ')));
    case 'close': return closeBrowser();
    default: printHelp();
  }
}

function printHelp() {
  console.log(`
Gemini HTTP API 工具 - 跳过浏览器 DOM，直接调用内部 API

  node tools/gemini/gemini-api.mjs init              提取 Cookie 并缓存（首次/过期后执行）
  node tools/gemini/gemini-api.mjs ask "问题"         直接提问
  node tools/gemini/gemini-api.mjs plan "问题"        规划模式：学习路径建议
  node tools/gemini/gemini-api.mjs verify "内容"      验证模式：审查教学内容
  node tools/gemini/gemini-api.mjs quiz               盲区模式：出题测试
  node tools/gemini/gemini-api.mjs interview "主题"   面试模式：模拟追问
  node tools/gemini/gemini-api.mjs close             关闭 Chrome

  前置条件：
  1. 先执行 open（gemini-chat.mjs）启动 Chrome 并登录
  2. 再执行 init 提取 Cookie
  3. 之后可直接用 ask/plan/verify/quiz/interview

  所有交互自动保存到 tools/gemini/YYYY-MM-DD.md
`);
}

// ── Cookie Management ──────────────────────────
async function extractCookiesViaCDP() {
  console.log('通过 CDP 提取 Cookie...');
  const browser = await connectCDP();
  try {
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      console.error('Error: 未找到浏览器上下文。确保 Chrome 已打开并登录 Gemini。');
      process.exit(1);
    }
    const cookies = await contexts[0].cookies(['https://gemini.google.com']);
    if (cookies.length === 0) {
      console.error('Error: 未找到 Gemini Cookie。请先在浏览器中登录 gemini.google.com。');
      process.exit(1);
    }
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    writeFileSync(COOKIE_CACHE, cookieStr, 'utf-8');
    console.log(`已缓存 ${cookies.length} 个 Cookie`);

    // Extract AT token from page HTML
    const pages = contexts[0].pages();
    for (const page of pages) {
      if (page.url().includes('gemini.google.com')) {
        const atToken = await page.evaluate(() => {
          // SNlM0e is the AT/XSRF token in WIZ_global_data
          if (window.WIZ_global_data && window.WIZ_global_data.SNlM0e) {
            return window.WIZ_global_data.SNlM0e;
          }
          return null;
        });
        if (atToken) {
          writeFileSync(AT_TOKEN_CACHE, atToken, 'utf-8');
          console.log('AT Token 已缓存');
        } else {
          console.log('警告：未提取到 AT Token（可能影响请求，会尝试不带 token 调用）');
        }
        break;
      }
    }

    return cookieStr;
  } finally {
    await browser.close();
  }
}

function getCookieString() {
  try {
    return readFileSync(COOKIE_CACHE, 'utf-8').trim();
  } catch {
    return null;
  }
}

function getAtToken() {
  try {
    return readFileSync(AT_TOKEN_CACHE, 'utf-8').trim();
  } catch {
    return null;
  }
}

async function ensureCookies() {
  let cookies = getCookieString();
  if (!cookies) {
    console.log('Cookie 未缓存，正在提取...');
    cookies = await extractCookiesViaCDP();
  }
  return cookies;
}

// ── API Call ────────────────────────────────────
function buildRequestBody(text, options = {}) {
  // Match browser's actual request format: 81-element array
  const arr = new Array(81).fill(null);

  // [0] message content
  arr[0] = [text, 0, null, null, null, null, 0];

  // [1] locale
  arr[1] = ['zh-CN'];

  // [2] conversation metadata [cid, rid, rcid, ...]
  const conv = options.conversation;
  if (conv && conv.cid) {
    arr[2] = [conv.cid, conv.rid, conv.rcid, null, null, null, null, null, null, conv.nonce || ''];
  } else {
    arr[2] = ['', '', '', null, null, null, null, null, null, ''];
  }

  // [3] nonce token (empty for new conversation)
  arr[3] = '';

  // [6] [0]
  arr[6] = [0];

  // [7] streaming flag (1 = streaming, needed for 3.5 Flash)
  arr[7] = 1;

  // [10] 1
  arr[10] = 1;

  // [11] 0
  arr[11] = 0;

  // [17] [[3]]
  arr[17] = [[3]];

  // [18] 0
  arr[18] = 0;

  // [27] 1
  arr[27] = 1;

  // [30] [4]
  arr[30] = [4];

  // [41] [1]
  arr[41] = [1];

  // [53] 0
  arr[53] = 0;

  // [59] request UUID
  arr[59] = randomUUID();

  // [61] []
  arr[61] = [];

  // [67] 0
  arr[67] = 0;

  // [68] 1
  arr[68] = 1;

  // [79] 1
  arr[79] = 1;

  // [80] 1
  arr[80] = 1;

  return [null, JSON.stringify(arr)];
}

function generateId() {
  // Generate a random conversation ID similar to what Gemini uses
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 29; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

async function callStreamGenerate(prompt, cookieStr) {
  const ctx = loadContext();
  const conversation = ctx.conversation || null;
  const body = buildRequestBody(prompt, { conversation });
  const atToken = getAtToken();

  const modelId = MODEL_IDS[CURRENT_MODEL];
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'X-Same-Domain': '1',
    'Origin': 'https://gemini.google.com',
    'Referer': 'https://gemini.google.com/',
    'Cookie': cookieStr,
    'x-goog-ext-525001261-jspb': buildModelHeader(modelId),
    'x-goog-ext-525005358-jspb': JSON.stringify([randomUUID(), 1]),
    'x-goog-ext-73010989-jspb': '[0]',
    'x-goog-ext-73010990-jspb': '[0,0,0]',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  };

  let url = `${STREAM_URL}?bl=boq_assistant-bard-web`;
  if (atToken) {
    url += `&at=${encodeURIComponent(atToken)}`;
  }

  const formBody = `f.req=${encodeURIComponent(JSON.stringify(body))}`;

  console.log('发送请求...');
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formBody,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      console.error(`认证失败 (${response.status})。Cookie 可能已过期，请重新执行 init。`);
      try { writeFileSync(COOKIE_CACHE, '', 'utf-8'); } catch {}
      process.exit(1);
    }
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
  }

  // Read full response as text
  const rawText = await response.text();
  const { text, metadata } = parseStreamResponse(rawText);

  // Save conversation metadata for continuity
  if (metadata.cid) {
    const ctx = loadContext();
    saveContext({
      conversation: {
        cid: metadata.cid,
        rid: metadata.rid,
        rcid: metadata.rcid,
        nonce: metadata.nonce,
        updated_at: new Date().toISOString(),
      },
    });
  }

  return text;
}

function parseStreamResponse(raw) {
  let content = raw;

  // Strip anti-XSS prefix `)]}'\n`
  if (content.startsWith(")]}'")) {
    content = content.substring(content.indexOf('\n') + 1);
  }

  content = content.trim();

  // Try direct JSON parse first (most common for 3.5 Flash)
  let outerFrames;
  try {
    outerFrames = JSON.parse(content);
    if (!Array.isArray(outerFrames)) outerFrames = [outerFrames];
  } catch {
    // Fall back to length-prefixed frame parsing
    outerFrames = parseLengthPrefixedFrames(content);
    if (outerFrames.length === 0) {
      return `[解析失败] 原始响应前500字:\n${content.substring(0, 500)}`;
    }
  }

  // Unwrap wrb.fr envelope: [["wrb.fr", null, "<json_string>", ...]]
  const innerFrames = [];
  for (const frame of outerFrames) {
    if (Array.isArray(frame) && frame[0] === 'wrb.fr' && typeof frame[2] === 'string') {
      try {
        innerFrames.push(JSON.parse(frame[2]));
      } catch {
        innerFrames.push(frame);
      }
    } else if (Array.isArray(frame)) {
      innerFrames.push(frame);
    }
  }

  const text = extractTextFromParsed(innerFrames);
  const metadata = extractConversationMeta(innerFrames);
  return { text, metadata };
}

function parseLengthPrefixedFrames(content) {
  const frames = [];
  let pos = 0;
  while (pos < content.length) {
    const nlIdx = content.indexOf('\n', pos);
    if (nlIdx === -1) break;

    const lengthStr = content.substring(pos, nlIdx).trim();
    const length = parseInt(lengthStr, 10);
    if (isNaN(length) || length <= 0) {
      pos = nlIdx + 1;
      continue;
    }

    const jsonStart = nlIdx + 1;
    const jsonEnd = jsonStart + length;
    const jsonStr = jsonEnd <= content.length
      ? content.substring(jsonStart, jsonEnd)
      : content.substring(jsonStart);

    try {
      frames.push(JSON.parse(jsonStr));
    } catch {}

    pos = jsonEnd <= content.length ? jsonEnd + 1 : content.length;
  }
  return frames;
}

function extractTextFromParsed(frames) {
  // Streaming frames: each frame contains cumulative text (not delta)
  // Text path: frame[4][0][1][0] = text string
  // Take the LAST frame with text (most complete)

  let lastText = null;

  for (const frame of frames) {
    if (!Array.isArray(frame)) continue;

    const candidateList = frame[4];
    if (!Array.isArray(candidateList) || candidateList.length === 0) continue;

    const candidate = candidateList[0];
    if (!Array.isArray(candidate) || candidate.length < 2) continue;

    const textArr = candidate[1];
    if (Array.isArray(textArr) && typeof textArr[0] === 'string' && textArr[0].length > 0) {
      lastText = textArr[0];
    }
  }

  if (lastText) return lastText;

  return `[无法提取文本] 帧数: ${frames.length}`;
}

function extractConversationMeta(frames) {
  // Extract cid, rid, rcid, nonce from response frames
  let cid = null, rid = null, rcid = null, nonce = null;

  for (const frame of frames) {
    if (!Array.isArray(frame)) continue;

    // cid/rid at frame[1]
    if (Array.isArray(frame[1]) && typeof frame[1][0] === 'string' && frame[1][0].startsWith('c_')) {
      cid = frame[1][0];
      rid = frame[1][1];
    }

    // rcid at frame[4][0][0][0]
    const candidateList = frame[4];
    if (Array.isArray(candidateList) && candidateList[0]) {
      const candidate = candidateList[0];
      if (Array.isArray(candidate) && typeof candidate[0] === 'string' && candidate[0].startsWith('rc_')) {
        rcid = candidate[0];
      }
    }

    // nonce at frame[2]["26"] (in metadata frames)
    if (frame[2] && typeof frame[2] === 'object' && frame[2]['26']) {
      nonce = frame[2]['26'];
    }
  }

  return { cid, rid, rcid, nonce };
}

function getNested(obj, path) {
  let current = obj;
  for (const key of path) {
    if (current == null) return null;
    if (Array.isArray(current)) current = current[key];
    else return null;
  }
  return current;
}

function findDeepString(data, depth) {
  if (depth > 15) return null;
  if (typeof data === 'string' && data.length > 20) return data;
  if (!Array.isArray(data)) return null;
  for (const item of data) {
    const result = findDeepString(item, depth + 1);
    if (result) return result;
  }
  return null;
}

// ── Context Management ──────────────────────────
const DEFAULT_CONTEXT = {
  session_id: `sess_${Date.now()}`,
  updated_at: new Date().toISOString(),
  stage: '面试准备',
  milestones: [],
  rolling_window: [],
  mode_conversation_ids: {},
};

function loadContext() {
  try {
    const saved = JSON.parse(readFileSync(CONTEXT_FILE, 'utf-8'));
    return { ...DEFAULT_CONTEXT, ...saved };
  } catch {
    return { ...DEFAULT_CONTEXT };
  }
}

function saveContext(updates) {
  const current = loadContext();
  const ctx = { ...current, ...updates, updated_at: new Date().toISOString() };
  // Don't overwrite arrays with spread - use explicit values
  if (updates.rolling_window) ctx.rolling_window = updates.rolling_window;
  if (updates.mode_conversation_ids) ctx.mode_conversation_ids = updates.mode_conversation_ids;
  if (!existsSync(INTERACTIONS_DIR)) mkdirSync(INTERACTIONS_DIR, { recursive: true });
  writeFileSync(CONTEXT_FILE, JSON.stringify(ctx, null, 2), 'utf-8');
}

function buildContextEnvelope(mode, userPrompt) {
  const ctx = loadContext();
  const modeLabel = MODES[mode] || '通用';

  const lastTurn = ctx.rolling_window && ctx.rolling_window.length > 0
    ? ctx.rolling_window[ctx.rolling_window.length - 1]
    : null;

  // Three-section prompt (can be longer since we're not using contenteditable input)
  const sections = [];

  sections.push(`### 【当前任务】\n${userPrompt}`);
  sections.push(`### 【会议纪要】\n- 模式：${modeLabel}\n- 阶段：${ctx.stage}\n- 已确认：${ctx.milestones.length > 0 ? ctx.milestones.join('；') : '暂无'}`);

  if (ctx.rolling_window && ctx.rolling_window.length > 0) {
    const rollingSection = '### 【近期讨论】\n' + ctx.rolling_window.map((turn, i) =>
      `[${i + 1}] 问：${turn.query}\n    答：${turn.summary}`
    ).join('\n');
    sections.push(rollingSection);
  }

  return sections.join('\n\n---\n\n');
}

// ── Core Ask ────────────────────────────────────
async function askGemini(mode, prompt) {
  if (!prompt) {
    console.error('Error: 缺少问题。用法: node tools/gemini-api.mjs <mode> "你的问题"');
    process.exit(1);
  }

  const cookieStr = await ensureCookies();
  const fullPrompt = buildContextEnvelope(mode, prompt);

  console.log(`[${mode.toUpperCase()}] ${prompt}`);

  try {
    const response = await callStreamGenerate(fullPrompt, cookieStr);

    console.log('\n=== Gemini 回复 ===\n');
    console.log(response);
    console.log('\n=== 回复结束 ===');

    // Save interaction
    saveInteraction(mode, prompt, response);

    // Update rolling window
    const ctx = loadContext();
    const rolling = ctx.rolling_window || [];
    let summary = response.replace(/\s+/g, ' ');
    if (summary.length > 600) summary = summary.substring(0, 600) + '...(下略)';
    rolling.push({ query: prompt.substring(0, 150), summary });
    if (rolling.length > 3) rolling.shift();
    saveContext({ rolling_window: rolling });

    console.log('上下文已更新');
  } catch (err) {
    console.error('请求失败:', err.message);
    if (err.message.includes('401') || err.message.includes('403')) {
      console.log('提示：Cookie 可能过期，执行 node tools/gemini-api.mjs init 重新提取');
    }
  }
}

// ── Init ────────────────────────────────────────
async function initCookies() {
  console.log('=== Gemini Cookie 提取工具 ===');
  await extractCookiesViaCDP();
  console.log('\n初始化完成！现在可以使用 ask/plan/verify/quiz/interview 命令。');
}

// ── Close ───────────────────────────────────────
async function closeBrowser() {
  const { execSync } = await import('child_process');
  try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {}
  console.log('Chrome 已关闭');
}

// ── Helpers ─────────────────────────────────────
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

function saveInteraction(mode, question, response) {
  if (!existsSync(INTERACTIONS_DIR)) mkdirSync(INTERACTIONS_DIR, { recursive: true });

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().substring(0, 5);
  const filePath = join(INTERACTIONS_DIR, `${dateStr}.md`);

  const modeLabel = MODES[mode] || '通用';
  const entry = `
## [${timeStr}] 模式：${modeLabel} (API)

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

function generateQuizPrompt() {
  return `请根据我已学的 Node.js 基础（事件循环、Stream、HTTP、异步编程、错误处理）出3-5道测试题，从基础到深入递进，覆盖常见误区。不要给答案。`;
}

function generateInterviewPrompt(topic) {
  const t = topic || 'Node.js 全栈';
  return `请模拟 Node.js 全栈工程师面试，主题是"${t}"。从概念开始，逐步深入追问原理、场景、陷阱。每次只问一个问题，等我回答后再追问下一个。`;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
