import { useEffect, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from './services/api'
import './App.css'

const storedSession = () => JSON.parse(localStorage.getItem('hacka1-session') || 'null')

function App() {
  const [session, setSession] = useState(storedSession)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.token) return
    getCurrentUser(session.token)
      .then(({ data }) => setSession((currentSession) => {
        const nextSession = { ...currentSession, user: data.user }
        localStorage.setItem('hacka1-session', JSON.stringify(nextSession))
        return nextSession
      }))
      .catch(() => {
        localStorage.removeItem('hacka1-session')
        setSession(null)
      })
  }, [session?.token])

  const saveSession = (nextSession) => {
    localStorage.setItem('hacka1-session', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const logout = () => {
    localStorage.removeItem('hacka1-session')
    setSession(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const request = mode === 'login' ? loginUser : registerUser
      const { data } = await request(form)
      saveSession(data)
      setForm({ name: '', email: '', password: '' })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  if (session?.user) {
    return (
      <main className="home">
        <nav><span>Hacka1</span><button onClick={logout}>Log out</button></nav>
        <section>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Hello, {session.user.name}.</h1>
          <p>You are signed in and ready to build your hackathon project.</p>
          <div className="placeholder"><h2>Your homepage starts here</h2><p>Replace this card with your team’s main feature tomorrow.</p></div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">HACKA1 STARTER</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="subtitle">{mode === 'login' ? 'Sign in to view your dashboard.' : 'Register to get started.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <label>Name<input required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
          <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {message && <p className="error">{message}</p>}
          <button className="primary" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <p className="switch">{mode === 'login' ? 'New here?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage('') }}>{mode === 'login' ? 'Register' : 'Log in'}</button></p>
      </section>
    </main>
  )
}

export default App
