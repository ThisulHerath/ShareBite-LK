import { useEffect, useRef, useState } from 'react'
import { sendMessage } from '../services/gemini'

const WELCOME_MESSAGE = {
  role: 'model',
  text: "Hi! I'm **ShareBite Assistant** 🥗 — here to help you share and find food across Sri Lanka.\n\nYou can ask me:\n• How to list surplus food\n• How to reserve or cancel a food item\n• Food safety tips\n• How the platform works\n\nWhat can I help you with today?",
}

const QUICK_PROMPTS = [
  { label: '🍱 How do I share food?', text: 'How do I create a food listing?' },
  { label: '🔍 How do I find food?', text: 'How do I find and reserve food near me?' },
  { label: '⏱️ Cancellation policy', text: 'When can I cancel my food reservation?' },
  { label: '🛡️ Food safety tips', text: 'What food safety tips should I follow when collecting food?' },
]

// Simple markdown-like renderer: bold (**text**) and newlines
function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    // Handle line breaks
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const send = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setError('')
    setShowQuickPrompts(false)

    const userMsg = { role: 'user', text: userText }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    // Build history to send (exclude the welcome message)
    const history = messages.slice(1)

    try {
      const reply = await sendMessage(history, userText)
      setMessages((prev) => [...prev, { role: 'model', text: reply }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const reset = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
    setError('')
    setShowQuickPrompts(true)
  }

  return (
    <>
      <style>{`
        @keyframes sb-chat-pop {
          0% { transform: scale(0.7) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes sb-typing {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes sb-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(23, 107, 89, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(23, 107, 89, 0); }
          100% { box-shadow: 0 0 0 0 rgba(23, 107, 89, 0); }
        }
        .sb-chat-fab {
          animation: sb-pulse-ring 2.5s ease-out infinite;
        }
        .sb-chat-fab:hover {
          animation: none;
          transform: scale(1.08);
        }
        .sb-chat-window {
          animation: sb-chat-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .sb-chat-msg { transition: all 0.2s; }
        .sb-typing-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #9CB5AE;
          display: inline-block;
          animation: sb-typing 1.4s ease-in-out infinite;
        }
        .sb-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .sb-typing-dot:nth-child(3) { animation-delay: 0.4s; }
        .sb-chat-input:focus { outline: none; }
        .sb-quick-btn:hover {
          background: rgba(23, 107, 89, 0.12) !important;
          border-color: #104C40 !important;
          color: #104C40 !important;
        }
        .sb-send-btn:hover:not(:disabled) {
          background: #176B59 !important;
          transform: scale(1.05);
        }
        .sb-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* FLOATING ACTION BUTTON */}
      <button
        type="button"
        className="sb-chat-fab"
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI food assistant'}
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 1000,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #104C40, #176B59)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16, 76, 64, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          fontSize: '1.6rem',
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="sb-chat-window"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '28px',
            zIndex: 999,
            width: 'min(380px, calc(100vw - 40px))',
            maxHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#FFFDF8',
            border: '2px solid #D9ED89',
            borderRadius: '24px',
            boxShadow: '0 24px 64px rgba(16, 76, 64, 0.2), 0 4px 16px rgba(16, 76, 64, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: 'linear-gradient(135deg, #104C40, #176B59)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(217, 237, 137, 0.2)',
                border: '1.5px solid rgba(217, 237, 137, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0,
              }}
            >
              🥗
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#D9ED89', fontWeight: '800', fontSize: '1rem' }}>
                ShareBite Assistant
              </div>
              <div style={{ color: 'rgba(217,237,137,0.7)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    display: 'inline-block',
                  }}
                />
                Powered by Gemini AI · Always here to help
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              title="Start new conversation"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'rgba(217,237,137,0.8)',
                cursor: 'pointer',
                padding: '6px 8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                transition: 'background 0.2s',
              }}
            >
              New chat
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="sb-chat-msg"
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {/* Avatar */}
                {msg.role === 'model' && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #104C40, #176B59)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    🥗
                  </div>
                )}

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #104C40, #176B59)'
                      : '#F4FAF6',
                    color: msg.role === 'user' ? '#FFFAF0' : '#173A35',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    boxShadow: msg.role === 'user'
                      ? '0 2px 8px rgba(16, 76, 64, 0.25)'
                      : '0 1px 4px rgba(23, 58, 53, 0.07)',
                    border: msg.role === 'model' ? '1px solid #D9ED89' : 'none',
                  }}
                >
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #104C40, #176B59)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  🥗
                </div>
                <div
                  style={{
                    padding: '14px 16px',
                    background: '#F4FAF6',
                    border: '1px solid #D9ED89',
                    borderRadius: '18px 18px 18px 4px',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                  aria-label="ShareBite Assistant is typing"
                >
                  <span className="sb-typing-dot" />
                  <span className="sb-typing-dot" />
                  <span className="sb-typing-dot" />
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#dc2626',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* QUICK PROMPTS */}
            {showQuickPrompts && messages.length === 1 && (
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '0.75rem', color: '#9CB5AE', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
                  Tap a question to get started
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.text}
                      type="button"
                      className="sb-quick-btn"
                      onClick={() => send(qp.text)}
                      style={{
                        background: 'rgba(217,237,137,0.15)',
                        border: '1.5px solid rgba(217,237,137,0.6)',
                        borderRadius: '12px',
                        padding: '9px 14px',
                        color: '#5D706B',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT AREA */}
          <div
            style={{
              padding: '14px 16px',
              borderTop: '1.5px solid #D9ED89',
              background: '#FFFDF8',
              flexShrink: 0,
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end',
            }}
          >
            <textarea
              ref={inputRef}
              className="sb-chat-input"
              rows={1}
              placeholder="Ask about food sharing, reservations…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                // Auto-resize
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #D9ED89',
                background: '#F4FAF6',
                color: '#173A35',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'none',
                lineHeight: '1.45',
                minHeight: '40px',
                maxHeight: '100px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#176B59')}
              onBlur={(e) => (e.target.style.borderColor = '#D9ED89')}
            />
            <button
              type="button"
              className="sb-send-btn"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #104C40, #176B59)',
                border: 'none',
                color: '#D9ED89',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 76, 64, 0.25)',
              }}
            >
              ➤
            </button>
          </div>

          {/* FOOTER NOTE */}
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(217,237,137,0.1)',
              borderTop: '1px solid rgba(217,237,137,0.3)',
              fontSize: '0.68rem',
              color: '#9CB5AE',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            AI responses may not always be accurate. For urgent food safety concerns, contact the donor directly.
          </div>
        </div>
      )}
    </>
  )
}
