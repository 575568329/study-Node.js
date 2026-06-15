# RAG技术深度追问清单

更新时间：2026-06-11
参考：LangChain Interview Questions + RAG Handbook + 行业最佳实践

---

## 使用说明

这份清单是对已有《RAG项目追问清单.md》的技术深度补充。已有清单聚焦应用层（"你的项目怎么做的"），本清单聚焦原理层（"为什么这样设计"）。

**回答原则**：先说结论 → 再说原理 → 最后说你的项目如何应用

---

## 一、Chunking策略

### 1. 固定大小、语义分割、句子窗口，各自适用场景？

**答题要点**：
- **固定大小（Fixed-size）**：按字符数或token数切分，简单高效，适合结构化文档
- **语义分割（Semantic）**：按段落、章节等语义单元切分，保持语义完整性，适合长文档
- **句子窗口（Sentence Window）**：以句子为单位，保留前后句子上下文，适合问答场景
- **你的项目**：用的固定大小（500 token + 50 overlap），因为文档格式多样，语义分割实现复杂

### 2. Overlap作用是什么？设置多少合适？

**答题要点**：
- **作用**：避免关键信息被切断在两个chunk边界
- **原理**：相邻chunk有重叠部分，检索时能捕获跨边界的信息
- **设置**：一般10%-20%的chunk大小，如chunk 500 token，overlap 50-100 token
- **trade-off**：overlap太小信息丢失，太大存储浪费、检索冗余
- **你的项目**：500 token chunk + 50 token overlap（10%），经验证这个比例召回效果好

### 3. Chunking对检索质量的影响？

**答题要点**：
- **chunk太小**：语义不完整，召回精度低
- **chunk太大**：噪音多，相关性分数被稀释
- **最佳实践**：根据query长度调整，短query用小chunk（256-512），长query用大chunk（1024-2048）
- **你的项目**：固定500 token，后续可以做动态调整（根据文档类型）

---

## 二、Embedding模型

### 4. text-embedding-3 vs sentence-transformers vs BGE，如何选型？

**答题要点**：
- **text-embedding-3（OpenAI/GLM）**：商业API，效果好，成本高，维度1536
- **sentence-transformers（开源）**：本地部署，免费，效果稍弱，维度768
- **BGE（智源）**：中文优化，开源，效果接近商业模型，维度768/1024
- **选型考虑**：成本、语言、部署方式、维度
- **你的项目**：用GLM的embedding-3（1536维），因为和GLM-4-flash同生态、中文效果好、API简单

### 5. Embedding维度（512 vs 1536）对检索的影响？

**答题要点**：
- **高维（1536）**：表达能力强，能捕获更细微的语义差异，但存储和计算成本高
- **低维（512）**：存储省、检索快，但语义表达能力弱
- **trade-off**：维度不是越高越好，要看实际场景的召回要求
- **你的项目**：用1536维，因为文档是专业资料，需要高精度语义匹配

### 6. 为什么选GLM的embedding-3？和OpenAI ada-002比有什么优劣？

**答题要点**：
- **GLM优势**：中文优化、价格便宜、和GLM-4-flash同生态（减少跨服务调用）
- **OpenAI优势**：英文效果更好、生态更成熟（Pinecone等向量库原生支持）
- **你的选择**：项目是中文文档为主，GLM性价比更高
- **后续演进**：如果做多语言，考虑用OpenAI或Cohere的多语言模型

---

## 三、向量检索算法

### 7. HNSW vs IVF vs Flat，trade-off是什么？

**答题要点**：
- **Flat（暴力搜索）**：遍历所有向量计算相似度，精确但慢，适合小规模（<10万）
- **IVF（倒排文件索引）**：聚类 + 倒排，快但召回率略低，适合中等规模（10万-百万）
- **HNSW（分层导航小世界图）**：构建多层图，召回率高、速度快，适合大规模（百万+）
- **你的项目**：当前用Flat（文档量<1万），后续迁移Chroma会用HNSW

### 8. 余弦相似度 vs 欧氏距离 vs 点积，哪个更适合文本检索？

**答题要点**：
- **余弦相似度**：计算向量夹角，归一化后只看方向不看长度，适合文本（因为embedding已归一化）
- **欧氏距离**：计算向量间距离，受向量长度影响，适合图像
- **点积**：向量内积，速度最快，但需要向量归一化
- **文本检索首选余弦相似度**：因为embedding模型输出已归一化，余弦=点积，但语义更清晰
- **你的项目**：用余弦相似度（FileStore默认、Chroma默认）

### 9. 你的FileStore和ChromaStore底层用的什么算法？

**答题要点**：
- **FileStore**：本地JSON存储 + 遍历计算余弦相似度（Flat算法），适合<1万文档
- **ChromaStore**：底层用SQLite + DuckDB + HNSW索引，适合10万+文档
- **切换时机**：文档量超过1万或检索速度明显下降时，迁移到Chroma
- **你的项目**：当前FileStore够用，接口已抽象，迁移只需改配置

---

## 四、混合检索与Reranking

### 10. RRF（Reciprocal Rank Fusion）算法具体怎么算权重？

**答题要点**：
- **公式**：`score = sum(1 / (k + rank_i))`，k是常数（通常60）
- **原理**：融合多路检索结果，rank越靠前score越高
- **示例**：
  - 向量检索：[doc1, doc2, doc3]，rank分别是1/2/3
  - 关键词检索：[doc2, doc1, doc4]，rank分别是1/2/3
  - RRF融合：doc1 = 1/(60+1) + 1/(60+2) ≈ 0.032；doc2 = 1/(60+2) + 1/(60+1) ≈ 0.032；doc3 = 1/(60+3)；doc4 = 1/(60+3)
  - 最终排序：doc1 ≈ doc2 > doc3 ≈ doc4
- **你的项目**：k=60（默认值），后续可以调参优化

### 11. 为什么需要Reranking？Cohere Rerank vs Cross-Encoder？

**答题要点**：
- **为什么需要**：向量检索是粗排（快但不够准），Reranking是精排（慢但更准）
- **Cohere Rerank**：商业API，效果好，按调用次数收费
- **Cross-Encoder**：开源模型（如ms-marco-MiniLM），本地部署，免费但需要GPU
- **工作流**：向量检索召回Top-50 → Reranking精排Top-10 → 返回用户
- **你的项目**：当前没用Reranking（增加延迟和成本），后续如果召回精度不够再加

### 12. 你的混合检索topK怎么定的？有调参吗？

**答题要点**：
- **topK=5**：向量检索和关键词检索各取5个，RRF融合后取Top-5返回用户
- **调参过程**：测试了topK=3/5/10，发现5个时召回率和响应速度平衡最好
- **trade-off**：topK太小召回不全，太大噪音多、LLM上下文浪费
- **后续优化**：可以根据query复杂度动态调整topK

---

## 五、Prompt工程

### 13. Few-shot vs Chain-of-Thought vs ReAct，各自适用场景？

**答题要点**：
- **Few-shot**：给几个示例，让模型模仿，适合格式化输出（JSON、表格）
- **Chain-of-Thought（CoT）**：让模型一步步推理，适合复杂推理任务（数学题、逻辑题）
- **ReAct**：推理（Reasoning）+ 行动（Acting），适合需要调用工具的场景（搜索、计算）
- **你的项目**：RAG问答用的是Few-shot（给示例教模型如何引用来源）

### 14. 如何避免模型胡说（Hallucination）？

**答题要点**：
- **方法1：强制引用来源**：Prompt里要求"必须基于提供的文档回答，不能编造"
- **方法2：置信度判断**：如果检索结果相似度<0.7，明确告诉用户"文档中未找到相关内容"
- **方法3：用户反馈**：提供"这个回答有帮助吗"，收集bad case优化Prompt
- **你的项目**：用了方法1和方法2，Prompt模板里明确要求引用来源、无相关内容时标注

### 15. 你的RAG项目的Prompt模板长什么样？

**答题要点**（展示你真的做过）：
```
你是一个专业的文档问答助手。请基于以下文档片段回答用户问题。

【重要规则】
1. 必须基于提供的文档内容回答，不能编造信息
2. 如果文档中没有相关内容，明确告诉用户"文档中未找到相关信息"
3. 回答要引用来源，格式：[文档名-第X页]

【文档片段】
{context}

【用户问题】
{question}

【回答】
```

**优化空间**：
- 加Few-shot示例（教模型如何引用）
- 加Chain-of-Thought（复杂问题先分解再回答）

---

## 六、LangChain/LangGraph架构

### 16. ConversationBufferMemory vs ConversationSummaryMemory，如何选择？

**答题要点**：
- **BufferMemory**：保存完整对话历史，上下文完整但token消耗大
- **SummaryMemory**：用LLM总结历史对话，省token但信息损失
- **选择**：对话轮次<10用Buffer，>10用Summary或滑动窗口（保留最近5轮）
- **你的项目**：用BufferMemory + 滑动窗口（保留最近3轮），因为文档问答一般不超过5轮

### 17. ReAct vs Plan-and-Execute vs Reflection，区别是什么？

**答题要点**：
- **ReAct**：每步推理后决定下一步行动（观察→思考→行动），适合简单任务
- **Plan-and-Execute**：先制定计划，再逐步执行，适合多步骤任务
- **Reflection**：执行后反思结果，决定是否重试，适合需要自我修正的任务
- **你的项目**：当前用的是简单的检索链（不算Agent），后续如果做多步推理会用Plan-and-Execute

### 18. 你的LangGraph工作流有什么条件分支？工具调用是什么？

**答题要点**（如果简历写了LangGraph，必须能讲清楚）：
- **条件分支**：检查检索结果相似度 → 如果>0.7走RAG回答，<0.7返回"无相关内容"
- **工具调用**：向量检索工具、关键词检索工具、知识图谱查询工具
- **状态管理**：维护当前kbId、对话历史、检索结果
- **如果你没用LangGraph的复杂特性**：诚实说"当前主要用LangChain的检索链，LangGraph只在知识图谱生成时用了简单的状态管理"

### 19. Retry策略、Fallback、Circuit Breaker如何设计？

**答题要点**：
- **Retry**：API调用失败时重试3次，指数退避（1s、2s、4s）
- **Fallback**：GLM API失败时降级到本地模型或返回"服务暂时不可用"
- **Circuit Breaker**：连续失败5次后熔断，30秒后自动恢复
- **你的项目**：实现了简单的Retry（3次），Fallback和Circuit Breaker在生产环境时会加

### 20. LangSmith怎么用？你用过吗？

**答题要点**：
- **LangSmith**：LangChain官方的调试和监控工具，追踪每步执行、查看中间结果
- **用法**：设置环境变量 `LANGCHAIN_API_KEY`，自动上报trace
- **你的项目**：了解过但没深度使用（因为是个人项目，用console.log调试），生产环境会接入
- **诚实表达**：不要说没用过的工具"很熟"，说"了解原理、能快速上手"更可信

---

## 七、前端性能优化

### 21. 虚拟DOM和Diff算法的核心思路？

**答题要点**：
- **虚拟DOM**：用JS对象表示DOM树，对比新旧虚拟DOM找出差异，批量更新真实DOM
- **Diff算法**：同层对比（不跨层）、key优化（复用节点）、类型不同直接替换
- **优势**：减少DOM操作次数、批量更新提升性能
- **你的项目**：Vue2/Vue3、React都基于虚拟DOM，GIS项目的大列表渲染受益于此

### 22. requestAnimationFrame为什么适合做显示时序控制？

**答题要点**：
- **原理**：浏览器每帧（16.6ms）刷新前调用，与屏幕刷新率同步
- **优势**：避免丢帧、自动节流、页面不可见时暂停
- **你的GIS项目**：10000个监测点分批渲染，每帧100个，避免主线程阻塞
- **代码思路**：
```javascript
function renderPointsInBatches(points, batchSize = 100) {
  let index = 0;
  function render() {
    const batch = points.slice(index, index + batchSize);
    batch.forEach(point => map.addMarker(point));
    index += batchSize;
    if (index < points.length) {
      requestAnimationFrame(render);
    }
  }
  render();
}
```

---

## 八、Node.js核心

### 23. 事件循环的6个阶段，每个阶段做什么？

**答题要点**：
- **timers**：执行setTimeout/setInterval回调
- **pending callbacks**：执行延迟的I/O回调
- **idle, prepare**：内部使用
- **poll**：检索新的I/O事件，执行I/O回调
- **check**：执行setImmediate回调
- **close callbacks**：执行socket.on('close')等关闭回调
- **你的项目**：理解事件循环帮助我优化异步任务顺序（如文件上传后立即embedding）

### 24. Stream的背压（backpressure）是什么？

**答题要点**：
- **问题**：读取速度 > 处理速度，内存溢出
- **背压机制**：当缓冲区满时，暂停读取，等待消费
- **实现**：`readable.pipe(writable)` 自动处理背压
- **你的项目**：文件上传用Stream处理大文件，避免一次性加载到内存

### 25. Next.js的Server Component和Client Component区别？

**答题要点**：
- **Server Component**：服务端渲染，不打包到客户端JS，适合静态内容
- **Client Component**：客户端交互，需要useState/useEffect，用 `'use client'` 声明
- **trade-off**：Server Component省流量、SEO好，但不能用浏览器API
- **你的项目**：RAG问答界面用Client Component（需要WebSocket），文档展示用Server Component

---

## 使用建议

1. **不要背答案**：理解原理比背模板重要，面试官会追问细节
2. **结合项目讲**：每个原理讲完，立即说"我的项目是这样应用的"
3. **诚实表达**：没用过的技术说"了解原理、能快速上手"，不要硬吹
4. **准备代码**：重点问题（如RRF算法、RAF分批渲染）能写出伪代码
5. **优先级**：RAG部分（1-20题）必须全会，前端和Node.js（21-25题）根据岗位侧重准备
