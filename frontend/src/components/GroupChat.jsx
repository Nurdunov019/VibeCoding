import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'

export default function GroupChat({ groupId, user }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const load = useCallback(async () => {
    if (!groupId) return
    try {
      const data = await api.getChat(groupId)
      setMessages(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [groupId])

  useAutoRefresh(load, 10000)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      await api.sendChat(groupId, text.trim())
      setText('')
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!groupId) {
    return <p style={{ color: 'var(--muted)' }}>Топту тандаңыз</p>
  }

  return (
    <div className="chat-box">
      {error && <p className="error-msg">{error}</p>}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Билдирүү жок. Биринчи сөздү сиз жазыңыз!</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-msg ${m.user_id === user.id ? 'own' : ''}`}
          >
            <div className="chat-msg-header">
              <strong>{m.author_role === 'teacher' ? 'Устаз' : m.author_name}</strong>
              <span>{new Date(m.created_at).toLocaleTimeString('ky-KG', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input" onSubmit={send}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Билдирүү жазыңыз..."
          maxLength={500}
        />
        <button type="submit" className="btn btn-primary btn-sm">Жөнөтүү</button>
      </form>
    </div>
  )
}
