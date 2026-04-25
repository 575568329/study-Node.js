// 'use client'
// import { useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
//   const [input, setInput] = useState('')
//   const [content, setContent] = useState('')

//   function handleSendMessage(userInput: string) {
//     const userMsg = { role: 'user', content: userInput }
//     const newMessages = [...messages, userMsg]
//     setMessages(newMessages)
//     setInput('')

//     let fullContent = ''

//     fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message: newMessages }),
//     }).then(res => {
//       const reader = res.body?.getReader()
//       const decoder = new TextDecoder()

//       function process({ done, value }: { done: boolean; value?: Uint8Array }) {
//         if (done) {
//           setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
//           return
//         }
//         const chunk = decoder.decode(value, { stream: true })
//         const lines = chunk.split('\n').filter(line => line.startsWith('data:'))
//         for (const line of lines) {
//           const data = line.slice(6)
//           if (data === '[DONE]') break
//           try {
//             const json = JSON.parse(data)
//             const delta = json.choices[0]?.delta?.content
//             if (delta) {
//               fullContent += delta
//               setContent(fullContent)
//             }
//           } catch {}
//         }
//         reader?.read().then(process)
//       }

//       reader?.read().then(process)
//     })
//   }

//   return (
//     <div>
//       <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
//       />
//       <button onClick={() => handleSendMessage(input)}>发送</button>
//     </div>
//   )
// }

'use client'
import { useChat } from '@ai-sdk/react'
import { useState,useRef } from 'react'
import { DefaultChatTransport } from 'ai'

export default function Chat() {
  const [ chatId, setChatId] = useState('chat-1')
  const [ mode, setMode ] = useState('developer') // analyst
  const modeRef  = useRef(mode)
  modeRef.current = mode
  const addToolOutputRef = useRef<((args: any) => void) | null>(null)
  const { messages,  sendMessage, status, stop, regenerate, addToolOutput } = useChat({
    id:chatId,
    transport: new DefaultChatTransport({
      body: ()=>({mode: modeRef.current}) //analyst
    }),
    onToolCall: async ({toolCall}) => {
      if (toolCall.toolName === 'getLocation') {
        try{
        // 用 navigator.geolocation 获取位置
        // 返回结果字符串
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        addToolOutputRef.current?.({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          result: `你当前的位置是：经度${position.coords.longitude}，纬度${position.coords.latitude}`
        })
        }catch(e){
          addToolOutputRef.current?.({
            tool: 'getLocation',
            toolCallId: toolCall.toolCallId,
            result: `获取位置失败，无法获取位置信息，用户可能拒绝了授权`
          })
        }
      }
    },
    // sendAutomaticallyWhen: ({ messages }) => {
    //   const lastMsg = messages[messages.length - 1]
    //   if (!lastMsg?.parts) return false
    //   return lastMsg.parts.some(
    //     p => p.type.startsWith('tool-') && (p as any).state === 'output-available'
    //   )
    // }
  })
  addToolOutputRef.current = addToolOutput
  const [input, setInput] = useState('')
  interface ToolCallPart {
    type: string,
    state: string,
    input?: unknown,
    output?: unknown,
  }
  const handleNewChat = () => {
    setChatId('chat-' + Date.now())
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat({mode})</h1>
      <div className="space-y-4 mb-4">
        {messages.map(m => {
          // 需要显示工具调用和思考过程，还有执行步骤数
          const text = m.parts
            ?.filter(p => p.type === 'text')
            .map(p => p.text)
            .join('') ?? ''
          const toolCalls = m.parts?.filter(p => p.type.indexOf('tool') === 0 )
          const thoughts = m.parts?.filter(p => p.type === 'reasoning')
          return (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className={m.role === 'user' ? 'text-blue-600' : 'text-gray-800'}>
                {m.role}:
              </span>{' '}
              {(toolCalls as ToolCallPart[])?.map((t, i) => (
                <div key={i} className="bg-gray-100 p-2 rounded my-2">
                  <div className="text-sm text-gray-500">工具调用: {t.type}</div>
                  <pre className="text-sm">参数：{JSON.stringify(t.input)}</pre>
                  {typeof t.output !== 'undefined' && <div className="text-sm">结果: {JSON.stringify(t.output)}</div>}
                </div>
              ))}
              {thoughts?.map((t, i) => (
                <div key={i} className="bg-yellow-100 p-2 rounded my-2">
                  <div className="text-sm text-yellow-500">思考过程:</div>
                  <pre className="text-sm">{t.text}</pre>
                </div>
              ))}
              {text}
                {
                m.role === 'assistant' && status === 'ready'?
                <div>
                  <button
                  onClick={() => regenerate()}
                  className='text-sm text-gray-400'
                  >重新生成</button>
                </div>
                :
                ''
                }
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="说点什么..."
          className="w-full border rounded px-3 py-2"
          disabled={status !== 'ready'}
        />
        <div>
        {
          status === 'ready'||status === 'error'?
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            发送
          </button>
          :
          <button
            type="button"
            onClick={stop}
            className="mt-2 ml-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            停止
          </button>
        }
        <button 
          className="mt-2 ml-2 bg-green-600 text-white px-4 py-2 rounded"
          disabled={status !== 'ready'}
          type='button' 
          onClick={handleNewChat}>
          开始新对话
        </button>
        <button
          className="mt-2 ml-2 bg-gray-600 text-white px-4 py-2 rounded"
          type='button'
          onClick={() => setMode(mode === 'developer' ? 'analyst' : 'developer')}
        >   
          切换角色
        </button>
        </div>
      </form>
    </div>
  )
}