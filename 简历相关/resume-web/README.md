# Resume Web

React 版简历生成项目，用于维护多个求职方向的简历，并通过浏览器打印导出 PDF。

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS v4

## 简历版本

当前内置 3 个版本：

- 通用版：`general`
- 纯前端：`frontend`
- Node.js 全栈 AI：`nodeFullstack`

默认打开通用版。普通前端岗位投通用版或纯前端版；AI、小团队全栈、Next.js / Node.js 岗位投 Node.js 全栈 AI 版。

核心内容在：

```text
src/resumeVersions.ts
```

后续修改简历时，优先改这个数据文件。

## 启动

```bash
npm install
npm run dev
```

访问控制台输出的本地地址。

## 导出 PDF

1. 打开页面。
2. 选择简历版本。
3. 浏览器按 `Ctrl + P`。
4. 目标打印机选择“另存为 PDF”。
5. 纸张选择 A4，边距选择“无”或“默认”，关闭页眉页脚。

## AI 修改建议

为了让 AI 更容易稳定修改：

- 内容放在 `src/resumeVersions.ts`。
- 页面结构放在 `src/App.tsx`。
- 打印样式放在 `src/styles.css`。
- 三个版本统一使用蓝色视觉，PDF 中会隐藏版本切换控件。
- 不要直接修改导出的 PDF。
- 每次生成 PDF 前先在浏览器预览是否分页正常。
