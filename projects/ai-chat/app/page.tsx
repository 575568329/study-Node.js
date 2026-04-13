'use client'
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [content, setContent] = useState('')

  function handleSendMessage(userInput: string) {
    const userMsg = { role: 'user', content: userInput }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')

    let fullContent = ''

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessages }),
    }).then(res => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      function process({ done, value }: { done: boolean; value?: Uint8Array }) {
        if (done) {
          setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
          return
        }
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.startsWith('data:'))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const delta = json.choices[0]?.delta?.content
            if (delta) {
              fullContent += delta
              setContent(fullContent)
            }
          } catch {}
        }
        reader?.read().then(process)
      }

      reader?.read().then(process)
    })
  }

  return (
    <div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
      />
      <button onClick={() => handleSendMessage(input)}>发送</button>
    </div>
  )
}
