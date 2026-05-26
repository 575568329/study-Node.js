import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import express from 'express';
import { WebSocketServer } from 'ws';
import { chromium } from 'playwright';

// ── Config ─────────────────────────────────────
const PORT = 3456;
const CDP_PORT = 19222;
const DIR = import.meta.dirname;
const CONV_DIR = join(DIR, 'conversations');
const COOKIE_CACHE = join(DIR, '.gemini-cookies.txt');
const AT_TOKEN_CACHE = join(DIR, '.gemini-at-token.txt');
const CONTEXT_FILE = join(DIR, 'context.json');

const STREAM_URL = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
const MODEL_IDS = { flash35: '56fdd199312815e2' };
const CURRENT_MODEL = process.env.GEMINI_MODEL || 'flash35';

// ── Auth Token ──────────────────────────────────
const AUTH_TOKEN = randomUUID();
console.log(`鉴权 Token: ${AUTH_TOKEN}`);

// ── Cookie / AT Token ───────────────────────────
function getCookieString() {
  try { return readFileSync(COOKIE_CACHE, 'utf-8').trim(); } catch { return null; }
}
function getAtToken() {
  try { return readFileSync(AT_TOKEN_CACHE, 'utf-8').trim(); } catch { return null; }
}
async function ensureCookies() {
  let cookies = getCookieString();
  if (!cookies) {
    console.log('Cookie 未缓存，通过 CDP 提取...');
    cookies = await extractCookiesViaCDP();
  }
  return cookies;
}

async function extractCookiesViaCDP() {
  const browser = await connectCDP();
  try {
    const ctx = browser.contexts()[0];
    if (!ctx) throw new Error('未找到浏览器上下文');
    const cookies = await ctx.cookies(['https://gemini.google.com']);
    if (cookies.length === 0) throw new Error('未找到 Gemini Cookie');
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    writeFileSync(COOKIE_CACHE, cookieStr, 'utf-8');
    console.log(`已缓存 ${cookies.length} 个 Cookie`);

    for (const page of ctx.pages()) {
      if (page.url().includes('gemini.google.com')) {
        const at = await page.evaluate(() => window.WIZ_global_data?.SNlM0e || null);
        if (at) { writeFileSync(AT_TOKEN_CACHE, at, 'utf-8'); console.log('AT Token 已缓存'); }
        break;
      }
    }
    return cookieStr;
  } finally { await browser.close(); }
}

async function connectCDP() {
  for (let i = 0; i < 30; i++) {
    try { return await chromium.connectOverCDP(`http://localhost:${CDP_PORT}`); }
    catch { if (i === 5) console.log('  等待 Chrome...'); await new Promise(r => setTimeout(r, 1000)); }
  }
  throw new Error('无法连接 Chrome。先执行: node tools/gemini-chat.mjs open');
}

// ── Gemini API ──────────────────────────────────
function buildRequestBody(text, conversation) {
  const arr = new Array(81).fill(null);
  arr[0] = [text, 0, null, null, null, null, 0];
  arr[1] = ['zh-CN'];
  if (conversation?.cid) {
    arr[2] = [conversation.cid, conversation.rid, conversation.rcid, null, null, null, null, null, null, conversation.nonce || ''];
  } else {
    arr[2] = ['', '', '', null, null, null, null, null, null, ''];
  }
  arr[3] = '';
  arr[6] = [0]; arr[7] = 1; arr[10] = 1; arr[11] = 0;
  arr[17] = [[3]]; arr[18] = 0; arr[27] = 1; arr[30] = [4];
  arr[41] = [1]; arr[53] = 0; arr[59] = randomUUID();
  arr[61] = []; arr[67] = 0; arr[68] = 1; arr[79] = 1; arr[80] = 1;
  return [null, JSON.stringify(arr)];
}

function buildModelHeader(modelId) {
  return `[1,null,null,null,"${modelId}",null,null,0,[4,5,6,8],null,null,2,null,null,1,1,null]`;
}

function parseStreamResponse(raw) {
  let content = raw;
  if (content.startsWith(")]}'")) content = content.substring(content.indexOf('\n') + 1);
  content = content.trim();

  let outerFrames;
  try {
    outerFrames = JSON.parse(content);
    if (!Array.isArray(outerFrames)) outerFrames = [outerFrames];
  } catch {
    outerFrames = parseLengthPrefixedFrames(content);
    if (outerFrames.length === 0) return { text: `[解析失败]`, metadata: {} };
  }

  const innerFrames = [];
  for (const frame of outerFrames) {
    if (Array.isArray(frame) && frame[0] === 'wrb.fr' && typeof frame[2] === 'string') {
      try { innerFrames.push(JSON.parse(frame[2])); } catch { innerFrames.push(frame); }
    } else if (Array.isArray(frame)) {
      innerFrames.push(frame);
    }
  }

  return { text: extractText(innerFrames), metadata: extractMeta(innerFrames) };
}

function parseLengthPrefixedFrames(content) {
  const frames = []; let pos = 0;
  while (pos < content.length) {
    const nlIdx = content.indexOf('\n', pos);
    if (nlIdx === -1) break;
    const length = parseInt(content.substring(pos, nlIdx).trim(), 10);
    if (isNaN(length) || length <= 0) { pos = nlIdx + 1; continue; }
    const jsonStart = nlIdx + 1;
    const jsonEnd = jsonStart + length;
    try { frames.push(JSON.parse(content.substring(jsonStart, jsonEnd <= content.length ? jsonEnd : undefined))); } catch {}
    pos = jsonEnd <= content.length ? jsonEnd + 1 : content.length;
  }
  return frames;
}

function extractText(frames) {
  let lastText = null;
  for (const frame of frames) {
    if (!Array.isArray(frame)) continue;
    const cl = frame[4];
    if (!Array.isArray(cl) || !cl[0]) continue;
    const c = cl[0];
    if (Array.isArray(c?.[1]) && typeof c[1][0] === 'string' && c[1][0].length > 0) lastText = c[1][0];
  }
  return lastText || `[无法提取文本] 帧数: ${frames.length}`;
}

function extractMeta(frames) {
  let cid = null, rid = null, rcid = null, nonce = null;
  for (const frame of frames) {
    if (!Array.isArray(frame)) continue;
    if (Array.isArray(frame[1]) && typeof frame[1]?.[0] === 'string' && frame[1][0].startsWith('c_')) {
      cid = frame[1][0]; rid = frame[1][1];
    }
    const cl = frame[4];
    if (Array.isArray(cl) && cl[0] && Array.isArray(cl[0]) && typeof cl[0][0] === 'string' && cl[0][0].startsWith('rc_')) rcid = cl[0][0];
    if (frame[2] && typeof frame[2] === 'object' && frame[2]['26']) nonce = frame[2]['26'];
  }
  return { cid, rid, rcid, nonce };
}

// 流式调用：AsyncGenerator，逐 chunk yield
async function* streamGenerate(prompt, cookieStr, conversation) {
  const body = buildRequestBody(prompt, conversation);
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
  if (atToken) url += `&at=${encodeURIComponent(atToken)}`;

  const formBody = `f.req=${encodeURIComponent(JSON.stringify(body))}`;
  const response = await fetch(url, { method: 'POST', headers, body: formBody });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
  }

  // Gemini 响应是完整的 JSON 文本（非分行推送），用 response.text() 一次性读取
  const rawText = await response.text();
  const { text, metadata } = parseStreamResponse(rawText);

  // 作为一次性结果 yield
  yield { type: 'chunk', content: text };
  yield { type: 'done', content: text, metadata };
}

// ── Conversation Store ──────────────────────────
function ensureConvDir() {
  if (!existsSync(CONV_DIR)) mkdirSync(CONV_DIR, { recursive: true });
}

function loadConvIndex() {
  ensureConvDir();
  try { return JSON.parse(readFileSync(join(CONV_DIR, 'index.json'), 'utf-8')); }
  catch { return []; }
}

function saveConvIndex(index) {
  ensureConvDir();
  writeFileSync(join(CONV_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf-8');
}

function loadMessages(convId) {
  try { return JSON.parse(readFileSync(join(CONV_DIR, `${convId}.json`), 'utf-8')); }
  catch { return []; }
}

function saveMessages(convId, messages) {
  ensureConvDir();
  writeFileSync(join(CONV_DIR, `${convId}.json`), JSON.stringify(messages, null, 2), 'utf-8');
}

function createConversation(title) {
  const id = `conv_${Date.now()}`;
  const now = new Date().toISOString();
  const index = loadConvIndex();
  const conv = { id, title: title || '新对话', createdAt: now, updatedAt: now, geminiMeta: null };
  index.unshift(conv);
  saveConvIndex(index);
  saveMessages(id, []);
  return conv;
}

function getConversation(convId) {
  return loadConvIndex().find(c => c.id === convId) || null;
}

function updateConversation(convId, updates) {
  const index = loadConvIndex();
  const conv = index.find(c => c.id === convId);
  if (conv) {
    Object.assign(conv, updates, { updatedAt: new Date().toISOString() });
    saveConvIndex(index);
  }
  return conv;
}

function deleteConversation(convId) {
  const index = loadConvIndex();
  const filtered = index.filter(c => c.id !== convId);
  if (filtered.length === index.length) return false;
  saveConvIndex(filtered);
  try { unlinkSync(join(CONV_DIR, `${convId}.json`)); } catch {}
  return true;
}

// 构建会话降级上下文：拼接历史消息
function buildHistoryContext(messages) {
  const lines = ['[系统] 这是一个续接的对话，以下是历史记录：\n'];
  for (const msg of messages) {
    if (msg.role === 'user') lines.push(`用户：${msg.content}`);
    else if (msg.role === 'gemini') lines.push(`Gemini：${msg.content}`);
    else if (msg.role === 'claude-context') lines.push(`[Claude注入]：${msg.content}`);
  }
  lines.push('\n---\n请基于以上上下文继续对话。');
  return lines.join('\n');
}

// ── Express Server ──────────────────────────────
const app = express();
app.use(express.json());

// 鉴权中间件
function authCheck(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// 静态页面
app.get('/', (_req, res) => {
  res.sendFile(join(import.meta.dirname, 'gemini-chat.html'));
});

// REST API
app.get('/api/conversations', authCheck, (_req, res) => {
  res.json(loadConvIndex());
});

app.get('/api/conversations/:id', authCheck, (req, res) => {
  const conv = getConversation(req.params.id);
  if (!conv) return res.status(404).json({ error: '对话不存在' });
  res.json({ ...conv, messages: loadMessages(req.params.id) });
});

app.post('/api/inject', authCheck, async (req, res) => {
  const { conversationId, content } = req.body;
  if (!content) return res.status(400).json({ error: '缺少 content' });

  let convId = conversationId;
  let conv;

  // 没有 conversationId 则用第一个对话或新建
  if (!convId) {
    const index = loadConvIndex();
    if (index.length > 0) { convId = index[0].id; }
    else { conv = createConversation('Claude 注入上下文'); convId = conv.id; }
  }

  conv = conv || getConversation(convId);
  if (!conv) return res.status(404).json({ error: '对话不存在' });

  // 保存注入消息
  const messages = loadMessages(convId);
  messages.push({ role: 'claude-context', content, timestamp: new Date().toISOString() });
  saveMessages(convId, messages);
  updateConversation(convId, {});

  // 发送给 Gemini
  try {
    const cookieStr = await ensureCookies();
    const injectPrompt = `[Claude 上下文注入]\n${content}\n\n请确认收到以上上下文信息。`;

    let fullText = '';
    const stream = streamGenerate(injectPrompt, cookieStr, conv.geminiMeta);
    let newMeta = null;

    for await (const chunk of stream) {
      if (chunk.type === 'done') {
        fullText = chunk.content;
        newMeta = chunk.metadata;
      }
    }

    // 保存 Gemini 回复
    if (fullText) {
      messages.push({ role: 'gemini', content: fullText, timestamp: new Date().toISOString() });
      saveMessages(convId, messages);
    }

    // 更新会话 meta
    if (newMeta?.cid) {
      updateConversation(convId, { geminiMeta: newMeta });
    }

    // WS 推送给页面
    broadcastWs({ type: 'inject', conversationId: convId, content, geminiReply: fullText });

    res.json({ success: true, conversationId: convId, geminiReply: fullText });
  } catch (err) {
    console.error('Inject 调用失败:', err.message);
    broadcastWs({ type: 'inject', conversationId: convId, content });
    res.json({ success: true, conversationId: convId, warning: `Gemini 调用失败: ${err.message}` });
  }
});

app.post('/api/chat', authCheck, async (req, res) => {
  const { conversationId, content } = req.body;
  if (!content) return res.status(400).json({ error: '缺少 content' });

  let convId = conversationId;
  let conv;

  if (!convId) {
    const index = loadConvIndex();
    if (index.length > 0) convId = index[0].id;
    else { conv = createConversation(content.substring(0, 20)); convId = conv.id; }
  }

  conv = conv || getConversation(convId);
  if (!conv) return res.status(404).json({ error: '对话不存在' });

  const messages = loadMessages(convId);
  messages.push({ role: 'user', content, timestamp: new Date().toISOString() });

  try {
    const cookieStr = await ensureCookies();
    let prompt = content;
    let geminiMeta = conv.geminiMeta;

    // 尝试调用，失败时会话降级
    let fullText = '';
    let newMeta = null;

    try {
      const stream = streamGenerate(prompt, cookieStr, geminiMeta);
      for await (const chunk of stream) {
        if (chunk.type === 'done') { fullText = chunk.content; newMeta = chunk.metadata; }
      }
    } catch (err) {
      // 会话降级：拼接历史，新建会话
      console.log(`会话降级: ${err.message}，尝试冷启动...`);
      geminiMeta = null;
      prompt = buildHistoryContext(messages);
      const stream = streamGenerate(prompt, cookieStr, null);
      for await (const chunk of stream) {
        if (chunk.type === 'done') { fullText = chunk.content; newMeta = chunk.metadata; }
      }
    }

    if (fullText) {
      messages.push({ role: 'gemini', content: fullText, timestamp: new Date().toISOString() });
    }
    saveMessages(convId, messages);

    if (newMeta?.cid) updateConversation(convId, { geminiMeta: newMeta });

    // 自动标题（首条消息时）
    if (messages.filter(m => m.role === 'user').length === 1) {
      updateConversation(convId, { title: content.substring(0, 20) });
    }

    res.json({ success: true, conversationId: convId, reply: fullText });
  } catch (err) {
    saveMessages(convId, messages);
    res.status(500).json({ error: err.message });
  }
});

// ── WebSocket Server ────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n服务器已启动: http://localhost:${PORT}`);
  console.log(`REST API 鉴权: Bearer ${AUTH_TOKEN}\n`);
});

const wss = new WebSocketServer({ server, path: '/ws' });
const wsClients = new Set();

function broadcastWs(data) {
  const msg = JSON.stringify(data);
  for (const ws of wsClients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

wss.on('connection', (ws) => {
  wsClients.add(ws);
  console.log('WS 客户端连接');

  // 发送对话列表
  ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));

  ws.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    try {
      switch (msg.type) {
        case 'list':
          ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
          break;

        case 'new_conversation':
          const newConv = createConversation(msg.title);
          ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
          ws.send(JSON.stringify({ type: 'switched', conversationId: newConv.id, messages: [] }));
          break;

        case 'switch':
          const switchConv = getConversation(msg.conversationId);
          if (switchConv) {
            ws.send(JSON.stringify({ type: 'switched', conversationId: msg.conversationId, messages: loadMessages(msg.conversationId) }));
          }
          break;

        case 'rename':
          if (msg.conversationId && msg.title) {
            updateConversation(msg.conversationId, { title: msg.title });
            ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
          }
          break;

        case 'delete':
          if (msg.conversationId) {
            const deleted = deleteConversation(msg.conversationId);
            if (deleted) {
              ws.send(JSON.stringify({ type: 'deleted', conversationId: msg.conversationId }));
              ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
            }
          }
          break;

        case 'chat':
          await handleChat(ws, msg);
          break;
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => { wsClients.delete(ws); console.log('WS 客户端断开'); });
});

async function handleChat(ws, msg) {
  const { conversationId, content } = msg;
  if (!content) return;

  let convId = conversationId;
  let conv;

  // 自动创建对话
  if (!convId) {
    conv = createConversation(content.substring(0, 20));
    convId = conv.id;
    ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
  }

  conv = conv || getConversation(convId);
  if (!conv) { ws.send(JSON.stringify({ type: 'error', message: '对话不存在' })); return; }

  // 保存用户消息
  const messages = loadMessages(convId);
  messages.push({ role: 'user', content, timestamp: new Date().toISOString() });
  saveMessages(convId, messages);

  ws.send(JSON.stringify({ type: 'stream_start', conversationId: convId }));

  try {
    const cookieStr = await ensureCookies();
    let prompt = content;
    let geminiMeta = conv.geminiMeta;
    let degraded = false;

    try {
      const stream = streamGenerate(prompt, cookieStr, geminiMeta);
      let fullText = '';

      for await (const chunk of stream) {
        if (chunk.type === 'chunk') {
          ws.send(JSON.stringify({ type: 'stream_chunk', conversationId: convId, content: chunk.content }));
          fullText += chunk.content;
        } else if (chunk.type === 'done') {
          fullText = chunk.content;
          const meta = chunk.metadata;

          // 更新消息
          const currentMsgs = loadMessages(convId);
          currentMsgs.push({ role: 'gemini', content: fullText, timestamp: new Date().toISOString() });
          saveMessages(convId, currentMsgs);

          if (meta?.cid) updateConversation(convId, { geminiMeta: meta });

          ws.send(JSON.stringify({ type: 'stream_end', conversationId: convId, fullText }));
        }
      }
    } catch (err) {
      // 会话降级
      console.log(`会话降级: ${err.message}`);
      ws.send(JSON.stringify({ type: 'stream_chunk', conversationId: convId, content: '\n[会话已续接]\n' }));

      const historyPrompt = buildHistoryContext(loadMessages(convId));
      const stream = streamGenerate(historyPrompt, cookieStr, null);
      let fullText = '';

      for await (const chunk of stream) {
        if (chunk.type === 'chunk') {
          ws.send(JSON.stringify({ type: 'stream_chunk', conversationId: convId, content: chunk.content }));
          fullText += chunk.content;
        } else if (chunk.type === 'done') {
          fullText = chunk.content;
          const meta = chunk.metadata;

          const currentMsgs = loadMessages(convId);
          currentMsgs.push({ role: 'gemini', content: fullText, timestamp: new Date().toISOString() });
          saveMessages(convId, currentMsgs);

          if (meta?.cid) updateConversation(convId, { geminiMeta: meta });
          updateConversation(convId, { title: content.substring(0, 20) });

          ws.send(JSON.stringify({ type: 'stream_end', conversationId: convId, fullText }));
        }
      }

      degraded = true;
    }

    // 自动标题
    const allMsgs = loadMessages(convId);
    if (allMsgs.filter(m => m.role === 'user').length === 1 && !degraded) {
      updateConversation(convId, { title: content.substring(0, 20) });
    }
    ws.send(JSON.stringify({ type: 'conversation_list', conversations: loadConvIndex() }));
  } catch (err) {
    ws.send(JSON.stringify({ type: 'error', message: err.message }));
    ws.send(JSON.stringify({ type: 'stream_end', conversationId: convId, fullText: '' }));
  }
}
